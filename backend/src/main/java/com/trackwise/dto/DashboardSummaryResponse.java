package com.trackwise.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * DashboardSummaryResponse — Financial summary metrics object containing:
 * Total Balance (current ledger balance), Period Income, Period Expense, Net Cash Flow,
 * Top Category, Savings %, Transactions count, Period Breakdown, Accounts, and Recent Transactions.
 */
public class DashboardSummaryResponse {

    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netCashFlow;
    private BigDecimal savings;
    private BigDecimal savingsRate;
    private String topCategory;
    private BigDecimal monthlySavingsPercentage;
    private BigDecimal averageDailySpend;
    private long transactionsThisMonth;
    private long transactionCount;
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<TransactionResponse> recentTransactions = new ArrayList<>();
    private List<CategoryBreakdownItem> categoryBreakdown = new ArrayList<>();
    private List<AccountResponse> accounts = new ArrayList<>();

    public DashboardSummaryResponse() {
    }

    /** Primary full constructor */
    public DashboardSummaryResponse(
            BigDecimal totalBalance,
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal netCashFlow,
            BigDecimal savingsRate,
            String topCategory,
            long transactionCount,
            String period,
            LocalDate startDate,
            LocalDate endDate,
            List<TransactionResponse> recentTransactions,
            List<CategoryBreakdownItem> categoryBreakdown,
            List<AccountResponse> accounts
    ) {
        this.totalBalance = totalBalance != null ? totalBalance : BigDecimal.ZERO;
        this.totalIncome = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        this.totalExpense = totalExpense != null ? totalExpense : BigDecimal.ZERO;
        this.netCashFlow = netCashFlow != null ? netCashFlow : BigDecimal.ZERO;
        this.savings = this.netCashFlow;
        this.savingsRate = savingsRate != null ? savingsRate : BigDecimal.ZERO;
        this.monthlySavingsPercentage = this.savingsRate;
        this.topCategory = topCategory;
        this.transactionCount = transactionCount;
        this.transactionsThisMonth = transactionCount;
        this.period = period;
        this.startDate = startDate;
        this.endDate = endDate;
        this.recentTransactions = recentTransactions != null ? recentTransactions : new ArrayList<>();
        this.categoryBreakdown = categoryBreakdown != null ? categoryBreakdown : new ArrayList<>();
        this.accounts = accounts != null ? accounts : new ArrayList<>();
    }

    /** Legacy constructor for backward compatibility */
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
        this.netCashFlow = savings != null ? savings : this.totalIncome.subtract(this.totalExpense);
        this.savings = this.netCashFlow;
        this.topCategory = topCategory;
        this.monthlySavingsPercentage = monthlySavingsPercentage != null ? monthlySavingsPercentage : BigDecimal.ZERO;
        this.savingsRate = this.monthlySavingsPercentage;
        this.averageDailySpend = averageDailySpend != null ? averageDailySpend : BigDecimal.ZERO;
        this.transactionsThisMonth = transactionsThisMonth;
        this.transactionCount = transactionsThisMonth;
        this.recentTransactions = recentTransactions != null ? recentTransactions : new ArrayList<>();
    }

    /** Legacy 5-arg constructor */
    public DashboardSummaryResponse(
            BigDecimal totalBalance,
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal savings,
            List<TransactionResponse> recentTransactions
    ) {
        this(totalBalance, totalIncome, totalExpense, savings, null, BigDecimal.ZERO, BigDecimal.ZERO, 0L, recentTransactions);
    }

    /** Legacy 4-arg constructor */
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

    public BigDecimal getNetCashFlow() {
        return netCashFlow;
    }

    public void setNetCashFlow(BigDecimal netCashFlow) {
        this.netCashFlow = netCashFlow;
    }

    public BigDecimal getSavings() {
        return savings != null ? savings : netCashFlow;
    }

    public void setSavings(BigDecimal savings) {
        this.savings = savings;
    }

    public BigDecimal getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(BigDecimal savingsRate) {
        this.savingsRate = savingsRate;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public BigDecimal getMonthlySavingsPercentage() {
        return monthlySavingsPercentage != null ? monthlySavingsPercentage : savingsRate;
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

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public List<CategoryBreakdownItem> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryBreakdownItem> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<AccountResponse> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountResponse> accounts) {
        this.accounts = accounts;
    }
}
