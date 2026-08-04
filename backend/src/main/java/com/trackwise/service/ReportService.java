package com.trackwise.service;

import com.trackwise.dto.ReportBudgetAnalyticsDto;
import com.trackwise.dto.ReportCategoryBreakdownDto;
import com.trackwise.dto.ReportFinancialInsightsDto;
import com.trackwise.dto.ReportGoalAnalyticsDto;
import com.trackwise.dto.ReportSummaryResponse;
import com.trackwise.dto.ReportTrendPointDto;
import com.trackwise.entity.Budget;
import com.trackwise.entity.Goal;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.BudgetRepository;
import com.trackwise.repository.GoalRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("MMM yyyy");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;

    public ReportService(TransactionRepository transactionRepository,
                         BudgetRepository budgetRepository,
                         GoalRepository goalRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
    }

    public ReportSummaryResponse getReportSummary(User user, LocalDate startDate, LocalDate endDate, String search, String category) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        // 1. Fetch user transactions within date range
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetween(user, start, end);

        // Optional filtering by search query & category
        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase().trim();
            transactions = transactions.stream()
                    .filter(t -> (t.getTitle() != null && t.getTitle().toLowerCase().contains(q)) ||
                            (t.getDescription() != null && t.getDescription().toLowerCase().contains(q)) ||
                            (t.getCategory() != null && t.getCategory().getName().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            String catQ = category.toLowerCase().trim();
            transactions = transactions.stream()
                    .filter(t -> t.getCategory() != null && t.getCategory().getName().toLowerCase().contains(catQ))
                    .collect(Collectors.toList());
        }

        // 2. Calculations for Income, Expenses, Net Savings
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        BigDecimal largestExpense = BigDecimal.ZERO;
        String largestExpenseTitle = "N/A";
        BigDecimal largestIncome = BigDecimal.ZERO;
        String largestIncomeTitle = "N/A";

        for (Transaction t : transactions) {
            BigDecimal amt = t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO;
            if (t.getType() == TransactionType.INCOME) {
                totalIncome = totalIncome.add(amt);
                if (amt.compareTo(largestIncome) > 0) {
                    largestIncome = amt;
                    largestIncomeTitle = t.getTitle();
                }
            } else if (t.getType() == TransactionType.EXPENSE) {
                totalExpenses = totalExpenses.add(amt);
                if (amt.compareTo(largestExpense) > 0) {
                    largestExpense = amt;
                    largestExpenseTitle = t.getTitle();
                }
            }
        }

        BigDecimal netSavings = totalIncome.subtract(totalExpenses);

        // Savings Rate % = (netSavings / totalIncome) * 100
        BigDecimal savingsRatePct = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRatePct = netSavings.multiply(BigDecimal.valueOf(100)).divide(totalIncome, 2, RoundingMode.HALF_UP);
            if (savingsRatePct.compareTo(BigDecimal.ZERO) < 0) {
                savingsRatePct = BigDecimal.ZERO;
            }
        }

        long daysCount = Math.max(1, ChronoUnit.DAYS.between(start, end) + 1);
        BigDecimal averageDailySpend = totalExpenses.divide(BigDecimal.valueOf(daysCount), 2, RoundingMode.HALF_UP);

        long monthsCount = Math.max(1, ChronoUnit.MONTHS.between(start.withDayOfMonth(1), end.withDayOfMonth(1)) + 1);
        BigDecimal averageMonthlySpend = totalExpenses.divide(BigDecimal.valueOf(monthsCount), 2, RoundingMode.HALF_UP);

        // 3. Category Breakdown (Expenses)
        List<ReportCategoryBreakdownDto> categoryBreakdown = buildCategoryBreakdown(transactions, totalExpenses);
        List<ReportCategoryBreakdownDto> topCategories = categoryBreakdown.stream().limit(10).collect(Collectors.toList());

        // 4. Trends (Income vs Expense, Cash Flow, Spending Trend)
        List<ReportTrendPointDto> trendPoints = buildTrendPoints(transactions, start, end);

        // 5. Budget Analytics
        ReportBudgetAnalyticsDto budgetAnalytics = buildBudgetAnalytics(user, start, end);

        // 6. Goal Analytics
        ReportGoalAnalyticsDto goalAnalytics = buildGoalAnalytics(user);

        // 7. Financial Insights
        ReportFinancialInsightsDto insights = buildInsights(
                categoryBreakdown,
                largestExpenseTitle, largestExpense,
                largestIncomeTitle, largestIncome,
                totalIncome, totalExpenses, netSavings,
                monthsCount, trendPoints, budgetAnalytics, goalAnalytics
        );

        return new ReportSummaryResponse(
                totalIncome,
                totalExpenses,
                netSavings,
                averageDailySpend,
                averageMonthlySpend,
                largestExpense,
                largestIncome,
                transactions.size(),
                savingsRatePct,
                budgetAnalytics.getBudgetUtilizationPercentage(),
                categoryBreakdown,
                trendPoints,
                trendPoints,
                trendPoints,
                budgetAnalytics,
                goalAnalytics,
                topCategories,
                insights,
                trendPoints
        );
    }

    private List<ReportCategoryBreakdownDto> buildCategoryBreakdown(List<Transaction> transactions, BigDecimal totalExpenses) {
        Map<String, BigDecimal> categorySumMap = new LinkedHashMap<>();
        Map<String, String> iconMap = new LinkedHashMap<>();
        Map<String, String> colorMap = new LinkedHashMap<>();
        Map<String, Long> countMap = new LinkedHashMap<>();

        for (Transaction t : transactions) {
            if (t.getType() == TransactionType.EXPENSE) {
                String catName = t.getCategory() != null ? t.getCategory().getName() : "Uncategorized";
                String icon = t.getCategory() != null ? t.getCategory().getIcon() : "Tag";
                String color = t.getCategory() != null ? t.getCategory().getColor() : "#3B82F6";
                BigDecimal amt = t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO;

                categorySumMap.put(catName, categorySumMap.getOrDefault(catName, BigDecimal.ZERO).add(amt));
                iconMap.putIfAbsent(catName, icon);
                colorMap.putIfAbsent(catName, color);
                countMap.put(catName, countMap.getOrDefault(catName, 0L) + 1);
            }
        }

        List<ReportCategoryBreakdownDto> result = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categorySumMap.entrySet()) {
            String catName = entry.getKey();
            BigDecimal amt = entry.getValue();
            BigDecimal pct = BigDecimal.ZERO;
            if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                pct = amt.multiply(BigDecimal.valueOf(100)).divide(totalExpenses, 2, RoundingMode.HALF_UP);
            }
            result.add(new ReportCategoryBreakdownDto(
                    catName,
                    iconMap.get(catName),
                    colorMap.get(catName),
                    amt,
                    pct,
                    countMap.getOrDefault(catName, 0L)
            ));
        }

        result.sort(Comparator.comparing(ReportCategoryBreakdownDto::getAmount).reversed());
        return result;
    }

    private List<ReportTrendPointDto> buildTrendPoints(List<Transaction> transactions, LocalDate start, LocalDate end) {
        long daysBetween = ChronoUnit.DAYS.between(start, end);
        boolean isMonthly = daysBetween > 60;

        Map<String, BigDecimal> incomeMap = new LinkedHashMap<>();
        Map<String, BigDecimal> expenseMap = new LinkedHashMap<>();

        for (Transaction t : transactions) {
            if (t.getDate() == null) continue;
            String key = isMonthly ? t.getDate().format(MONTH_FMT) : t.getDate().format(DATE_FMT);
            BigDecimal amt = t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO;
            if (t.getType() == TransactionType.INCOME) {
                incomeMap.put(key, incomeMap.getOrDefault(key, BigDecimal.ZERO).add(amt));
            } else {
                expenseMap.put(key, expenseMap.getOrDefault(key, BigDecimal.ZERO).add(amt));
            }
        }

        List<ReportTrendPointDto> points = new ArrayList<>();
        if (isMonthly) {
            LocalDate curr = start.withDayOfMonth(1);
            while (!curr.isAfter(end)) {
                String key = curr.format(MONTH_FMT);
                BigDecimal inc = incomeMap.getOrDefault(key, BigDecimal.ZERO);
                BigDecimal exp = expenseMap.getOrDefault(key, BigDecimal.ZERO);
                BigDecimal net = inc.subtract(exp);
                points.add(new ReportTrendPointDto(key, inc, exp, net));
                curr = curr.plusMonths(1);
            }
        } else {
            LocalDate curr = start;
            while (!curr.isAfter(end)) {
                String key = curr.format(DATE_FMT);
                BigDecimal inc = incomeMap.getOrDefault(key, BigDecimal.ZERO);
                BigDecimal exp = expenseMap.getOrDefault(key, BigDecimal.ZERO);
                BigDecimal net = inc.subtract(exp);
                points.add(new ReportTrendPointDto(key, inc, exp, net));
                curr = curr.plusDays(1);
            }
        }

        return points;
    }

    private ReportBudgetAnalyticsDto buildBudgetAnalytics(User user, LocalDate start, LocalDate end) {
        List<Budget> budgets = budgetRepository.findAllByUserOrderByCreatedAtDesc(user);

        BigDecimal totalAllocated = BigDecimal.ZERO;
        BigDecimal totalSpent = BigDecimal.ZERO;
        int overbudget = 0;
        int atRisk = 0;
        int onTrack = 0;

        for (Budget b : budgets) {
            totalAllocated = totalAllocated.add(b.getAmount() != null ? b.getAmount() : BigDecimal.ZERO);
            BigDecimal spent = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                    user, TransactionType.EXPENSE, b.getStartDate(), b.getEndDate());
            if (spent == null) spent = BigDecimal.ZERO;

            totalSpent = totalSpent.add(spent);

            if (b.getAmount() != null && b.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal pct = spent.multiply(BigDecimal.valueOf(100)).divide(b.getAmount(), 2, RoundingMode.HALF_UP);
                if (pct.compareTo(BigDecimal.valueOf(100)) >= 0) {
                    overbudget++;
                } else if (pct.compareTo(BigDecimal.valueOf(80)) >= 0) {
                    atRisk++;
                } else {
                    onTrack++;
                }
            }
        }

        BigDecimal remBudget = totalAllocated.subtract(totalSpent);
        if (remBudget.compareTo(BigDecimal.ZERO) < 0) remBudget = BigDecimal.ZERO;

        BigDecimal utilPct = BigDecimal.ZERO;
        if (totalAllocated.compareTo(BigDecimal.ZERO) > 0) {
            utilPct = totalSpent.multiply(BigDecimal.valueOf(100)).divide(totalAllocated, 2, RoundingMode.HALF_UP);
        }

        int totalBudgets = budgets.size();
        int healthScore = 100;
        if (totalBudgets > 0) {
            int penalty = (overbudget * 30) + (atRisk * 15);
            healthScore = Math.max(0, 100 - penalty);
        }

        return new ReportBudgetAnalyticsDto(
                totalAllocated, totalSpent, remBudget, utilPct,
                totalBudgets, overbudget, atRisk, onTrack, healthScore
        );
    }

    private ReportGoalAnalyticsDto buildGoalAnalytics(User user) {
        List<Goal> goals = goalRepository.findByUserOrderByTargetDateAsc(user);

        long totalGoals = goals.size();
        long activeGoals = 0;
        long completedGoals = 0;
        BigDecimal totalTarget = BigDecimal.ZERO;
        BigDecimal totalSaved = BigDecimal.ZERO;
        String nearestGoalName = null;
        String nearestGoalDate = null;
        LocalDate today = LocalDate.now();

        for (Goal g : goals) {
            BigDecimal tgt = g.getTargetAmount() != null ? g.getTargetAmount() : BigDecimal.ZERO;
            BigDecimal cur = g.getCurrentAmount() != null ? g.getCurrentAmount() : BigDecimal.ZERO;
            totalTarget = totalTarget.add(tgt);
            totalSaved = totalSaved.add(cur);

            if (cur.compareTo(tgt) >= 0) {
                completedGoals++;
            } else {
                activeGoals++;
                if (nearestGoalName == null && g.getTargetDate() != null && !g.getTargetDate().isBefore(today)) {
                    nearestGoalName = g.getName();
                    nearestGoalDate = g.getTargetDate().toString();
                }
            }
        }

        BigDecimal progressPct = BigDecimal.ZERO;
        if (totalTarget.compareTo(BigDecimal.ZERO) > 0) {
            progressPct = totalSaved.multiply(BigDecimal.valueOf(100)).divide(totalTarget, 2, RoundingMode.HALF_UP);
        }

        return new ReportGoalAnalyticsDto(
                totalGoals, activeGoals, completedGoals,
                totalTarget, totalSaved, progressPct,
                nearestGoalName, nearestGoalDate
        );
    }

    private ReportFinancialInsightsDto buildInsights(
            List<ReportCategoryBreakdownDto> categoryBreakdown,
            String largestExpenseTitle, BigDecimal largestExpense,
            String largestIncomeTitle, BigDecimal largestIncome,
            BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal netSavings,
            long monthsCount, List<ReportTrendPointDto> trendPoints,
            ReportBudgetAnalyticsDto budgetAnalytics, ReportGoalAnalyticsDto goalAnalytics) {

        String topCatName = categoryBreakdown.isEmpty() ? "None" : categoryBreakdown.get(0).getCategoryName();
        BigDecimal topCatAmt = categoryBreakdown.isEmpty() ? BigDecimal.ZERO : categoryBreakdown.get(0).getAmount();

        BigDecimal avgMonthlySavings = netSavings.divide(BigDecimal.valueOf(Math.max(1, monthsCount)), 2, RoundingMode.HALF_UP);

        String bestSavingsMonth = "N/A";
        String worstSpendingMonth = "N/A";
        BigDecimal maxNet = BigDecimal.valueOf(-Double.MAX_VALUE);
        BigDecimal maxExp = BigDecimal.ZERO;

        for (ReportTrendPointDto pt : trendPoints) {
            if (pt.getNetCashFlow().compareTo(maxNet) > 0) {
                maxNet = pt.getNetCashFlow();
                bestSavingsMonth = pt.getLabel();
            }
            if (pt.getExpense().compareTo(maxExp) > 0) {
                maxExp = pt.getExpense();
                worstSpendingMonth = pt.getLabel();
            }
        }

        String budgetStatusMsg = budgetAnalytics.getOverbudgetCount() > 0
                ? budgetAnalytics.getOverbudgetCount() + " budget(s) exceeded spending limit!"
                : budgetAnalytics.getTotalBudgets() > 0
                ? "All " + budgetAnalytics.getTotalBudgets() + " budgets are under control."
                : "No active budgets configured.";

        String goalMsg = goalAnalytics.getTotalGoals() > 0
                ? goalAnalytics.getCompletedGoals() + " of " + goalAnalytics.getTotalGoals() + " goals completed (" + goalAnalytics.getOverallProgressPercentage() + "% total progress)."
                : "No savings goals created yet.";

        return new ReportFinancialInsightsDto(
                topCatName, topCatAmt,
                largestExpenseTitle, largestExpense,
                largestIncomeTitle, largestIncome,
                avgMonthlySavings, bestSavingsMonth, worstSpendingMonth,
                budgetStatusMsg, goalMsg
        );
    }
}
