package com.trackwise.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DashboardSummaryResponse — Financial summary metrics (Total Income, Total Expense, Balance, Recent 5 Transactions).
 */
public class DashboardSummaryResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<TransactionResponse> recentTransactions;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance, List<TransactionResponse> recentTransactions) {
        this.totalIncome = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        this.totalExpense = totalExpense != null ? totalExpense : BigDecimal.ZERO;
        this.balance = balance != null ? balance : BigDecimal.ZERO;
        this.recentTransactions = recentTransactions;
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

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
