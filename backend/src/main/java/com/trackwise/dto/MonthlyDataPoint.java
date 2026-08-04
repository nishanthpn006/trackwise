package com.trackwise.dto;

import java.math.BigDecimal;

/**
 * MonthlyDataPoint — Represents one month of aggregated income and expense totals
 * for the Monthly Income vs Expense bar chart widget.
 */
public class MonthlyDataPoint {

    /** Human-readable month label, e.g. "Jan 2025". */
    private String month;

    private BigDecimal income;
    private BigDecimal expense;

    public MonthlyDataPoint() {
    }

    public MonthlyDataPoint(String month, BigDecimal income, BigDecimal expense) {
        this.month = month;
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }
}
