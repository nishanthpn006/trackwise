package com.trackwise.dto;

import java.math.BigDecimal;

public class ReportTrendPointDto {
    private String label; // e.g. "2026-08-01" or "Jan 2026"
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal netCashFlow;

    public ReportTrendPointDto() {
    }

    public ReportTrendPointDto(String label, BigDecimal income, BigDecimal expense, BigDecimal netCashFlow) {
        this.label = label;
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
        this.netCashFlow = netCashFlow != null ? netCashFlow : BigDecimal.ZERO;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public BigDecimal getIncome() { return income; }
    public void setIncome(BigDecimal income) { this.income = income; }

    public BigDecimal getExpense() { return expense; }
    public void setExpense(BigDecimal expense) { this.expense = expense; }

    public BigDecimal getNetCashFlow() { return netCashFlow; }
    public void setNetCashFlow(BigDecimal netCashFlow) { this.netCashFlow = netCashFlow; }
}
