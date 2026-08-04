package com.trackwise.dto;

import java.math.BigDecimal;

public class ReportGoalAnalyticsDto {
    private long totalGoals;
    private long activeGoals;
    private long completedGoals;
    private BigDecimal totalTargetAmount;
    private BigDecimal totalSaved;
    private BigDecimal overallProgressPercentage;
    private String nearestGoalName;
    private String nearestGoalDate;

    public ReportGoalAnalyticsDto() {
    }

    public ReportGoalAnalyticsDto(long totalGoals, long activeGoals, long completedGoals, BigDecimal totalTargetAmount,
                                 BigDecimal totalSaved, BigDecimal overallProgressPercentage, String nearestGoalName,
                                 String nearestGoalDate) {
        this.totalGoals = totalGoals;
        this.activeGoals = activeGoals;
        this.completedGoals = completedGoals;
        this.totalTargetAmount = totalTargetAmount != null ? totalTargetAmount : BigDecimal.ZERO;
        this.totalSaved = totalSaved != null ? totalSaved : BigDecimal.ZERO;
        this.overallProgressPercentage = overallProgressPercentage != null ? overallProgressPercentage : BigDecimal.ZERO;
        this.nearestGoalName = nearestGoalName;
        this.nearestGoalDate = nearestGoalDate;
    }

    public long getTotalGoals() { return totalGoals; }
    public void setTotalGoals(long totalGoals) { this.totalGoals = totalGoals; }

    public long getActiveGoals() { return activeGoals; }
    public void setActiveGoals(long activeGoals) { this.activeGoals = activeGoals; }

    public long getCompletedGoals() { return completedGoals; }
    public void setCompletedGoals(long completedGoals) { this.completedGoals = completedGoals; }

    public BigDecimal getTotalTargetAmount() { return totalTargetAmount; }
    public void setTotalTargetAmount(BigDecimal totalTargetAmount) { this.totalTargetAmount = totalTargetAmount; }

    public BigDecimal getTotalSaved() { return totalSaved; }
    public void setTotalSaved(BigDecimal totalSaved) { this.totalSaved = totalSaved; }

    public BigDecimal getOverallProgressPercentage() { return overallProgressPercentage; }
    public void setOverallProgressPercentage(BigDecimal overallProgressPercentage) { this.overallProgressPercentage = overallProgressPercentage; }

    public String getNearestGoalName() { return nearestGoalName; }
    public void setNearestGoalName(String nearestGoalName) { this.nearestGoalName = nearestGoalName; }

    public String getNearestGoalDate() { return nearestGoalDate; }
    public void setNearestGoalDate(String nearestGoalDate) { this.nearestGoalDate = nearestGoalDate; }
}
