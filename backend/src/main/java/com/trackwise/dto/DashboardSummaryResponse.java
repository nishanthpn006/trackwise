package com.trackwise.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DashboardSummaryResponse — Financial summary metrics (Total Income, Total Expense, Balance, Recent 5 Transactions).
 */
public class DashboardSummaryResponse {

    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal savings;
    private List<TransactionResponse> recentTransactions;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(BigDecimal totalBalance, BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal savings, List<TransactionResponse> recentTransactions) {
        this.totalBalance = totalBalance != null ? totalBalance : BigDecimal.ZERO;
        this.totalIncome = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        this.totalExpense = totalExpense != null ? totalExpense : BigDecimal.ZERO;
        this.savings = savings != null ? savings : BigDecimal.ZERO;
        this.recentTransactions = recentTransactions;
    }

    // Backward compatibility constructor
    public DashboardSummaryResponse(BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance, List<TransactionResponse> recentTransactions) {
        this(balance, totalIncome, totalExpense, balance, recentTransactions);
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    // Backward compatibility getter for balance
    public BigDecimal getBalance() {
        return totalBalance;
    }

    // Backward compatibility setter for balance
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

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
