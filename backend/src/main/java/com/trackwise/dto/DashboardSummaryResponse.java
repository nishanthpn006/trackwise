package com.trackwise.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DashboardSummaryResponse — Financial summary metrics object containing all 8 core dashboard KPIs:
 * Total Balance, Total Income, Total Expense, Savings, Top Category, Monthly Savings %, Average Daily Spend,
 * Transactions This Month, and Recent 5 Transactions.
 */
public class DashboardSummaryResponse {

    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal savings;
    private String topCategory;
    private BigDecimal monthlySavingsPercentage;
    private BigDecimal averageDailySpend;
    private long transactionsThisMonth;
    private List<TransactionResponse> recentTransactions;

    public DashboardSummaryResponse() {
    }

    /** Full constructor with all 8 metrics + recent transactions */
    public DashboardSummaryResponse(
            BigDecimal totalBalance,
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal savings,
            String topCategory,
            BigDecimal monthlySavingsPercentage,
            BigDecimal averageDailySpend,
            long transactionsThisMonth,
            List<TransactionResponse> recentTransactions
    ) {
        this.totalBalance = totalBalance != null ? totalBalance : BigDecimal.ZERO;
        this.totalIncome = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        this.totalExpense = totalExpense != null ? totalExpense : BigDecimal.ZERO;
        this.savings = savings != null ? savings : BigDecimal.ZERO;
        this.topCategory = topCategory;
        this.monthlySavingsPercentage = monthlySavingsPercentage != null ? monthlySavingsPercentage : BigDecimal.ZERO;
        this.averageDailySpend = averageDailySpend != null ? averageDailySpend : BigDecimal.ZERO;
        this.transactionsThisMonth = transactionsThisMonth;
        this.recentTransactions = recentTransactions;
    }

    /** Backward compatibility 5-argument constructor */
    public DashboardSummaryResponse(
            BigDecimal totalBalance,
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal savings,
            List<TransactionResponse> recentTransactions
    ) {
        this(totalBalance, totalIncome, totalExpense, savings, null, BigDecimal.ZERO, BigDecimal.ZERO, 0L, recentTransactions);
    }

    /** Backward compatibility 4-argument constructor */
    public DashboardSummaryResponse(
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal balance,
            List<TransactionResponse> recentTransactions
    ) {
        this(balance, totalIncome, totalExpense, balance, recentTransactions);
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public BigDecimal getBalance() {
        return totalBalance;
    }

    public void setBalance(BigDecimal balance) {
        this.totalBalance = balance;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getSavings() {
        return savings;
    }

    public void setSavings(BigDecimal savings) {
        this.savings = savings;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public BigDecimal getMonthlySavingsPercentage() {
        return monthlySavingsPercentage;
    }

    public void setMonthlySavingsPercentage(BigDecimal monthlySavingsPercentage) {
        this.monthlySavingsPercentage = monthlySavingsPercentage;
    }

    public BigDecimal getAverageDailySpend() {
        return averageDailySpend;
    }

    public void setAverageDailySpend(BigDecimal averageDailySpend) {
        this.averageDailySpend = averageDailySpend;
    }

    public long getTransactionsThisMonth() {
        return transactionsThisMonth;
    }

    public void setTransactionsThisMonth(long transactionsThisMonth) {
        this.transactionsThisMonth = transactionsThisMonth;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
