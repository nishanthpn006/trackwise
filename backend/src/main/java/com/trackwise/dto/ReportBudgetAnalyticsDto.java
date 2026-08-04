package com.trackwise.dto;

import java.math.BigDecimal;

public class ReportBudgetAnalyticsDto {
    private BigDecimal totalAllocated;
    private BigDecimal totalSpent;
    private BigDecimal remainingBudget;
    private BigDecimal budgetUtilizationPercentage;
    private int totalBudgets;
    private int overbudgetCount;
    private int atRiskCount;
    private int onTrackCount;
    private int budgetHealthScore; // 0-100 score

    public ReportBudgetAnalyticsDto() {
    }

    public ReportBudgetAnalyticsDto(BigDecimal totalAllocated, BigDecimal totalSpent, BigDecimal remainingBudget,
                                    BigDecimal budgetUtilizationPercentage, int totalBudgets, int overbudgetCount,
                                    int atRiskCount, int onTrackCount, int budgetHealthScore) {
        this.totalAllocated = totalAllocated != null ? totalAllocated : BigDecimal.ZERO;
        this.totalSpent = totalSpent != null ? totalSpent : BigDecimal.ZERO;
        this.remainingBudget = remainingBudget != null ? remainingBudget : BigDecimal.ZERO;
        this.budgetUtilizationPercentage = budgetUtilizationPercentage != null ? budgetUtilizationPercentage : BigDecimal.ZERO;
        this.totalBudgets = totalBudgets;
        this.overbudgetCount = overbudgetCount;
        this.atRiskCount = atRiskCount;
        this.onTrackCount = onTrackCount;
        this.budgetHealthScore = budgetHealthScore;
    }

    public BigDecimal getTotalAllocated() { return totalAllocated; }
    public void setTotalAllocated(BigDecimal totalAllocated) { this.totalAllocated = totalAllocated; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public BigDecimal getRemainingBudget() { return remainingBudget; }
    public void setRemainingBudget(BigDecimal remainingBudget) { this.remainingBudget = remainingBudget; }

    public BigDecimal getBudgetUtilizationPercentage() { return budgetUtilizationPercentage; }
    public void setBudgetUtilizationPercentage(BigDecimal budgetUtilizationPercentage) { this.budgetUtilizationPercentage = budgetUtilizationPercentage; }

    public int getTotalBudgets() { return totalBudgets; }
    public void setTotalBudgets(int totalBudgets) { this.totalBudgets = totalBudgets; }

    public int getOverbudgetCount() { return overbudgetCount; }
    public void setOverbudgetCount(int overbudgetCount) { this.overbudgetCount = overbudgetCount; }

    public int getAtRiskCount() { return atRiskCount; }
    public void setAtRiskCount(int atRiskCount) { this.atRiskCount = atRiskCount; }

    public int getOnTrackCount() { return onTrackCount; }
    public void setOnTrackCount(int onTrackCount) { this.onTrackCount = onTrackCount; }

    public int getBudgetHealthScore() { return budgetHealthScore; }
    public void setBudgetHealthScore(int budgetHealthScore) { this.budgetHealthScore = budgetHealthScore; }
}
