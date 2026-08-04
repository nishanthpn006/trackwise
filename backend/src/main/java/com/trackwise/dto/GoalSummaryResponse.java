package com.trackwise.dto;

import java.math.BigDecimal;

public class GoalSummaryResponse {

    private long totalGoals;
    private long activeGoals;
    private long completedGoals;
    private long overdueGoals;
    private BigDecimal totalTargetAmount;
    private BigDecimal totalSaved;
    private BigDecimal remainingSavings;
    private BigDecimal overallProgressPercentage;
    private GoalResponse nearestGoal;
    private long upcomingDeadlinesCount;

    public GoalSummaryResponse() {
    }

    public GoalSummaryResponse(long totalGoals, long activeGoals, long completedGoals, long overdueGoals,
                               BigDecimal totalTargetAmount, BigDecimal totalSaved, BigDecimal remainingSavings,
                               BigDecimal overallProgressPercentage, GoalResponse nearestGoal,
                               long upcomingDeadlinesCount) {
        this.totalGoals = totalGoals;
        this.activeGoals = activeGoals;
        this.completedGoals = completedGoals;
        this.overdueGoals = overdueGoals;
        this.totalTargetAmount = totalTargetAmount != null ? totalTargetAmount : BigDecimal.ZERO;
        this.totalSaved = totalSaved != null ? totalSaved : BigDecimal.ZERO;
        this.remainingSavings = remainingSavings != null ? remainingSavings : BigDecimal.ZERO;
        this.overallProgressPercentage = overallProgressPercentage != null ? overallProgressPercentage : BigDecimal.ZERO;
        this.nearestGoal = nearestGoal;
        this.upcomingDeadlinesCount = upcomingDeadlinesCount;
    }

    public long getTotalGoals() { return totalGoals; }
    public void setTotalGoals(long totalGoals) { this.totalGoals = totalGoals; }

    public long getActiveGoals() { return activeGoals; }
    public void setActiveGoals(long activeGoals) { this.activeGoals = activeGoals; }

    public long getCompletedGoals() { return completedGoals; }
    public void setCompletedGoals(long completedGoals) { this.completedGoals = completedGoals; }

    public long getOverdueGoals() { return overdueGoals; }
    public void setOverdueGoals(long overdueGoals) { this.overdueGoals = overdueGoals; }

    public BigDecimal getTotalTargetAmount() { return totalTargetAmount; }
    public void setTargetAmount(BigDecimal totalTargetAmount) { this.totalTargetAmount = totalTargetAmount; }

    public BigDecimal getTotalSaved() { return totalSaved; }
    public void setTotalSaved(BigDecimal totalSaved) { this.totalSaved = totalSaved; }

    public BigDecimal getRemainingSavings() { return remainingSavings; }
    public void setRemainingSavings(BigDecimal remainingSavings) { this.remainingSavings = remainingSavings; }

    public BigDecimal getOverallProgressPercentage() { return overallProgressPercentage; }
    public void setOverallProgressPercentage(BigDecimal overallProgressPercentage) { this.overallProgressPercentage = overallProgressPercentage; }

    public GoalResponse getNearestGoal() { return nearestGoal; }
    public void setNearestGoal(GoalResponse nearestGoal) { this.nearestGoal = nearestGoal; }

    public long getUpcomingDeadlinesCount() { return upcomingDeadlinesCount; }
    public void setUpcomingDeadlinesCount(long upcomingDeadlinesCount) { this.upcomingDeadlinesCount = upcomingDeadlinesCount; }
}
