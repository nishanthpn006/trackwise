package com.trackwise.service;

import com.trackwise.dto.CategoryBreakdownItem;
import com.trackwise.dto.DashboardAnalyticsResponse;
import com.trackwise.dto.FinancialInsights;
import com.trackwise.dto.MonthlyDataPoint;
import com.trackwise.dto.SpendingTrendPoint;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * AnalyticsService — Computes all analytics data for the dashboard analytics endpoint.
 *
 * <p>Isolated from {@link TransactionService}; reuses only {@link TransactionRepository}.
 * All computations are read-only and performed in a single database transaction per call.
 */
@Service
public class AnalyticsService {

    // Fallback colour palette for categories that have no colour set
    private static final List<String> FALLBACK_COLOURS = List.of(
            "#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6",
            "#a855f7", "#14b8a6", "#f97316", "#ec4899", "#84cc16"
    );

    private static final DateTimeFormatter MONTH_LABEL_FMT = DateTimeFormatter.ofPattern("MMM yyyy");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final TransactionRepository transactionRepository;

    public AnalyticsService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // ─── Public API ──────────────────────────────────────────────────────────

    /**
     * Builds the full analytics payload for the authenticated user.
     *
     * @param user the authenticated user
     * @return {@link DashboardAnalyticsResponse} containing all four analytics datasets
     */
    @Transactional(readOnly = true)
    public DashboardAnalyticsResponse getDashboardAnalytics(User user) {
        LocalDate today = LocalDate.now();

        List<MonthlyDataPoint> monthlyData = buildMonthlyData(user, today);
        List<CategoryBreakdownItem> categoryBreakdown = buildCategoryBreakdown(user, today);
        List<SpendingTrendPoint> spendingTrend = buildSpendingTrend(user, today);
        FinancialInsights insights = buildFinancialInsights(user, today, categoryBreakdown);

        return new DashboardAnalyticsResponse(monthlyData, categoryBreakdown, spendingTrend, insights);
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    /**
     * Builds last-6-months monthly income vs expense data (oldest → newest).
     */
    private List<MonthlyDataPoint> buildMonthlyData(User user, LocalDate today) {
        List<MonthlyDataPoint> points = new ArrayList<>();

        // Iterate from 5 months ago through current month
        for (int offset = 5; offset >= 0; offset--) {
            LocalDate monthStart = today.withDayOfMonth(1).minusMonths(offset);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());

            BigDecimal income = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                    user, TransactionType.INCOME, monthStart, monthEnd);
            BigDecimal expense = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                    user, TransactionType.EXPENSE, monthStart, monthEnd);

            String label = monthStart.format(MONTH_LABEL_FMT);
            points.add(new MonthlyDataPoint(
                    label,
                    income != null ? income : BigDecimal.ZERO,
                    expense != null ? expense : BigDecimal.ZERO
            ));
        }

        return points;
    }

    /**
     * Builds the expense-by-category breakdown for all time.
     * Uses a fallback colour palette when a category has no colour defined.
     * Sorted by amount descending.
     */
    @SuppressWarnings("null")
    private List<CategoryBreakdownItem> buildCategoryBreakdown(User user, LocalDate today) {
        // Fetch all-time expenses for category breakdown
        LocalDate allTimeStart = LocalDate.of(2000, 1, 1);
        List<Transaction> expenseTransactions = transactionRepository
                .findByUserAndTypeAndDateBetween(user, TransactionType.EXPENSE, allTimeStart, today);

        if (expenseTransactions.isEmpty()) {
            return List.of();
        }

        // Group by category name, accumulate amounts and pick colour from first seen entry
        Map<String, BigDecimal[]> grouped = new LinkedHashMap<>();
        Map<String, String> colourMap = new LinkedHashMap<>();
        int[] colourIndex = {0};

        for (Transaction tx : expenseTransactions) {
            String name = tx.getCategory() != null ? tx.getCategory().getName() : "Uncategorized";
            String colour = tx.getCategory() != null && tx.getCategory().getColor() != null
                    ? tx.getCategory().getColor()
                    : null;

            grouped.merge(name, new BigDecimal[]{tx.getAmount()},
                    (existing, incoming) -> new BigDecimal[]{existing[0].add(incoming[0])});

            if (!colourMap.containsKey(name)) {
                if (colour != null) {
                    colourMap.put(name, colour);
                } else {
                    colourMap.put(name, FALLBACK_COLOURS.get(colourIndex[0] % FALLBACK_COLOURS.size()));
                    colourIndex[0]++;
                }
            }
        }

        BigDecimal total = grouped.values().stream()
                .map(arr -> arr[0])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategoryBreakdownItem> items = grouped.entrySet().stream()
                .map(entry -> {
                    BigDecimal amount = entry.getValue()[0];
                    BigDecimal pct = total.compareTo(BigDecimal.ZERO) == 0
                            ? BigDecimal.ZERO
                            : amount.multiply(BigDecimal.valueOf(100))
                                    .divide(total, 1, RoundingMode.HALF_UP);
                    return new CategoryBreakdownItem(
                            entry.getKey(),
                            colourMap.get(entry.getKey()),
                            amount,
                            pct
                    );
                })
                .sorted(Comparator.comparing(CategoryBreakdownItem::getAmount).reversed())
                .collect(Collectors.toList());

        return items;
    }

    /**
     * Builds daily expense totals for the last 30 days (oldest → newest).
     * Days with no spending are emitted with amount = 0.
     */
    @SuppressWarnings("null")
    private List<SpendingTrendPoint> buildSpendingTrend(User user, LocalDate today) {
        LocalDate trendStart = today.minusDays(29);
        List<Transaction> expenses = transactionRepository
                .findByUserAndTypeAndDateBetween(user, TransactionType.EXPENSE, trendStart, today);

        // Map of date → total amount
        Map<LocalDate, BigDecimal> dailyMap = expenses.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getDate,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));

        List<SpendingTrendPoint> points = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            BigDecimal amount = dailyMap.getOrDefault(date, BigDecimal.ZERO);
            points.add(new SpendingTrendPoint(date.format(DATE_FMT), amount));
        }

        return points;
    }

    /**
     * Builds the Financial Insights KPI card data.
     */
    private FinancialInsights buildFinancialInsights(
            User user, LocalDate today, List<CategoryBreakdownItem> categoryBreakdown) {

        // Highest spending category (all-time)
        String highestCategory = categoryBreakdown.isEmpty() ? null : categoryBreakdown.get(0).getCategoryName();

        // Current month income and expense
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

        BigDecimal monthIncome = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.INCOME, monthStart, monthEnd);
        BigDecimal monthExpense = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, monthStart, monthEnd);

        if (monthIncome == null) monthIncome = BigDecimal.ZERO;
        if (monthExpense == null) monthExpense = BigDecimal.ZERO;

        BigDecimal currentMonthBalance = monthIncome.subtract(monthExpense);

        // Monthly savings percentage = (income - expense) / income * 100
        BigDecimal savingsPct = BigDecimal.ZERO;
        if (monthIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsPct = currentMonthBalance
                    .multiply(BigDecimal.valueOf(100))
                    .divide(monthIncome, 1, RoundingMode.HALF_UP);
        }

        // Average daily spending over the last 30 days
        LocalDate trendStart = today.minusDays(29);
        BigDecimal totalExpense30d = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, trendStart, today);
        if (totalExpense30d == null) totalExpense30d = BigDecimal.ZERO;

        BigDecimal avgDailySpending = totalExpense30d.divide(BigDecimal.valueOf(30), 2, RoundingMode.HALF_UP);

        // Total transaction count
        long transactionCount = transactionRepository.countByUser(user);

        return new FinancialInsights(highestCategory, savingsPct, avgDailySpending, transactionCount, currentMonthBalance);
    }
}
