package com.trackwise.dto;

import java.math.BigDecimal;

/**
 * FinancialInsights — Aggregated KPI metrics shown in the Financial Insights card widget.
 */
public class FinancialInsights {

    /** Name of the category with the highest total expense (null if no expenses). */
    private String highestSpendingCategory;

    /** Savings as a percentage of total income for the current month (0–100). */
    private BigDecimal monthlySavingsPercentage;

    /** Average daily expense over the last 30 days. */
    private BigDecimal averageDailySpending;

    /** Total number of transactions belonging to the authenticated user. */
    private long transactionCount;

    /** Net balance (income − expense) for the current calendar month. */
    private BigDecimal currentMonthBalance;

    public FinancialInsights() {
    }

    public FinancialInsights(
            String highestSpendingCategory,
            BigDecimal monthlySavingsPercentage,
            BigDecimal averageDailySpending,
            long transactionCount,
            BigDecimal currentMonthBalance
    ) {
        this.highestSpendingCategory = highestSpendingCategory;
        this.monthlySavingsPercentage = monthlySavingsPercentage != null ? monthlySavingsPercentage : BigDecimal.ZERO;
        this.averageDailySpending = averageDailySpending != null ? averageDailySpending : BigDecimal.ZERO;
        this.transactionCount = transactionCount;
        this.currentMonthBalance = currentMonthBalance != null ? currentMonthBalance : BigDecimal.ZERO;
    }

    public String getHighestSpendingCategory() {
        return highestSpendingCategory;
    }

    public void setHighestSpendingCategory(String highestSpendingCategory) {
        this.highestSpendingCategory = highestSpendingCategory;
    }

    public BigDecimal getMonthlySavingsPercentage() {
        return monthlySavingsPercentage;
    }

    public void setMonthlySavingsPercentage(BigDecimal monthlySavingsPercentage) {
        this.monthlySavingsPercentage = monthlySavingsPercentage;
    }

    public BigDecimal getAverageDailySpending() {
        return averageDailySpending;
    }

    public void setAverageDailySpending(BigDecimal averageDailySpending) {
        this.averageDailySpending = averageDailySpending;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public BigDecimal getCurrentMonthBalance() {
        return currentMonthBalance;
    }

    public void setCurrentMonthBalance(BigDecimal currentMonthBalance) {
        this.currentMonthBalance = currentMonthBalance;
    }
}
