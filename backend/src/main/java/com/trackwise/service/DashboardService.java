package com.trackwise.service;

import com.trackwise.dto.AccountResponse;
import com.trackwise.dto.CategoryBreakdownItem;
import com.trackwise.dto.DashboardSummaryResponse;
import com.trackwise.dto.TransactionResponse;
import com.trackwise.entity.Account;
import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;
import com.trackwise.entity.User;
import com.trackwise.repository.AccountRepository;
import com.trackwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * DashboardService — Core business logic for dashboard financial summaries,
 * period-based income/expense/cash-flow metrics, category breakdowns, and account summaries.
 */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final List<String> FALLBACK_COLOURS = List.of(
            "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
            "#06B6D4", "#EC4899", "#14B8A6", "#F97316", "#64748B"
    );

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public DashboardService(TransactionRepository transactionRepository,
                            AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    public DashboardSummaryResponse getDashboardSummary(User user, String period, LocalDate customStart, LocalDate customEnd) {
        DateRange range = resolveDateRange(period, customStart, customEnd);

        // 1. Total Balance: Current real financial position across active accounts
        List<Account> activeAccounts = accountRepository.findByUserAndIsArchivedFalseOrderByCreatedAtDesc(user);
        BigDecimal totalBalance;
        if (!activeAccounts.isEmpty()) {
            BigDecimal sum = BigDecimal.ZERO;
            for (Account account : activeAccounts) {
                BigDecimal bal = account.getCurrentBalance() != null ? account.getCurrentBalance() : account.getInitialBalance();
                if (bal != null) {
                    sum = sum.add(bal);
                }
            }
            totalBalance = sum;
        } else {
            BigDecimal lifetimeIncome = transactionRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
            BigDecimal lifetimeExpense = transactionRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);
            if (lifetimeIncome == null) lifetimeIncome = BigDecimal.ZERO;
            if (lifetimeExpense == null) lifetimeExpense = BigDecimal.ZERO;
            totalBalance = lifetimeIncome.subtract(lifetimeExpense);
        }

        // 2. Period Income and Expense
        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.INCOME, range.start, range.end);
        BigDecimal totalExpense = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, range.start, range.end);

        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        // 3. Net Cash Flow for the period
        BigDecimal netCashFlow = totalIncome.subtract(totalExpense);

        // 4. Savings rate percentage = (Net Cash Flow / Total Income) * 100
        BigDecimal savingsRate = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netCashFlow
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 1, RoundingMode.HALF_UP);
        }

        // 5. Transaction count in period
        long transactionCount = transactionRepository.countByUserAndDateBetween(user, range.start, range.end);

        // 6. Category breakdown for period (Expense only)
        List<CategoryBreakdownItem> categoryBreakdown = buildCategoryBreakdown(user, range.start, range.end, totalExpense);

        // 7. Top category in period
        String topCategory = categoryBreakdown.isEmpty() ? null : categoryBreakdown.get(0).getCategoryName();

        // 8. Recent 5 transactions (with account and category details)
        List<Transaction> recentEntities = transactionRepository.findTop5ByUserOrderByDateDescCreatedAtDesc(user);
        List<TransactionResponse> recentDtos = recentEntities.stream()
                .map(TransactionResponse::fromEntity)
                .collect(Collectors.toList());

        // 9. Account summaries
        List<AccountResponse> accountDtos = activeAccounts.stream()
                .map(a -> {
                    long txCount = transactionRepository.countByAccount(a);
                    return AccountResponse.fromEntity(a, txCount);
                })
                .collect(Collectors.toList());

        return new DashboardSummaryResponse(
                totalBalance,
                totalIncome,
                totalExpense,
                netCashFlow,
                savingsRate,
                topCategory,
                transactionCount,
                range.periodName,
                range.start,
                range.end,
                recentDtos,
                categoryBreakdown,
                accountDtos
        );
    }

    private DateRange resolveDateRange(String period, LocalDate customStart, LocalDate customEnd) {
        LocalDate today = LocalDate.now();
        if (period == null || period.trim().isEmpty()) {
            period = "THIS_MONTH";
        }

        String normalized = period.toUpperCase().trim();
        switch (normalized) {
            case "LAST_MONTH": {
                LocalDate lastMonth = today.minusMonths(1);
                LocalDate start = lastMonth.withDayOfMonth(1);
                LocalDate end = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth());
                return new DateRange("LAST_MONTH", start, end);
            }
            case "ALL_TIME": {
                LocalDate start = LocalDate.of(2000, 1, 1);
                return new DateRange("ALL_TIME", start, today);
            }
            case "CUSTOM": {
                if (customStart != null && customEnd != null && !customStart.isAfter(customEnd)) {
                    return new DateRange("CUSTOM", customStart, customEnd);
                }
                // Fallback to this month if custom range is incomplete or invalid
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
                return new DateRange("THIS_MONTH", start, end);
            }
            case "THIS_MONTH":
            default: {
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
                return new DateRange("THIS_MONTH", start, end);
            }
        }
    }

    private List<CategoryBreakdownItem> buildCategoryBreakdown(User user, LocalDate start, LocalDate end, BigDecimal totalExpense) {
        List<Transaction> expenseTransactions = transactionRepository
                .findByUserAndTypeAndDateBetween(user, TransactionType.EXPENSE, start, end);

        if (expenseTransactions.isEmpty() || totalExpense.compareTo(BigDecimal.ZERO) <= 0) {
            return new ArrayList<>();
        }

        Map<String, BigDecimal> groupedAmounts = new LinkedHashMap<>();
        Map<String, String> colourMap = new LinkedHashMap<>();
        int colourIndex = 0;

        for (Transaction tx : expenseTransactions) {
            String catName = tx.getCategory() != null ? tx.getCategory().getName() : "Uncategorized";
            BigDecimal existing = groupedAmounts.getOrDefault(catName, BigDecimal.ZERO);
            groupedAmounts.put(catName, existing.add(tx.getAmount()));

            if (!colourMap.containsKey(catName)) {
                String color = (tx.getCategory() != null && tx.getCategory().getColor() != null && !tx.getCategory().getColor().isBlank())
                        ? tx.getCategory().getColor()
                        : FALLBACK_COLOURS.get(colourIndex % FALLBACK_COLOURS.size());
                colourMap.put(catName, color);
                colourIndex++;
            }
        }

        List<CategoryBreakdownItem> items = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : groupedAmounts.entrySet()) {
            String name = entry.getKey();
            BigDecimal amount = entry.getValue();
            BigDecimal percentage = amount
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalExpense, 1, RoundingMode.HALF_UP);

            items.add(new CategoryBreakdownItem(name, colourMap.get(name), amount, percentage));
        }

        items.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        return items;
    }

    public static class DateRange {
        public final String periodName;
        public final LocalDate start;
        public final LocalDate end;

        public DateRange(String periodName, LocalDate start, LocalDate end) {
            this.periodName = periodName;
            this.start = start;
            this.end = end;
        }
    }
}
