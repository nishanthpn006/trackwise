package com.trackwise.dto;

import java.time.LocalDateTime;

public class UserStatisticsResponse {
    private long transactionsCount;
    private long categoriesCount;
    private long budgetsCount;
    private long goalsCount;
    private long reportsCount;
    private LocalDateTime memberSince;

    public UserStatisticsResponse() {
    }

    public UserStatisticsResponse(long transactionsCount, long categoriesCount, long budgetsCount, long goalsCount, long reportsCount, LocalDateTime memberSince) {
        this.transactionsCount = transactionsCount;
        this.categoriesCount = categoriesCount;
        this.budgetsCount = budgetsCount;
        this.goalsCount = goalsCount;
        this.reportsCount = reportsCount;
        this.memberSince = memberSince;
    }

    public long getTransactionsCount() { return transactionsCount; }
    public void setTransactionsCount(long transactionsCount) { this.transactionsCount = transactionsCount; }

    public long getCategoriesCount() { return categoriesCount; }
    public void setCategoriesCount(long categoriesCount) { this.categoriesCount = categoriesCount; }

    public long getBudgetsCount() { return budgetsCount; }
    public void setBudgetsCount(long budgetsCount) { this.budgetsCount = budgetsCount; }

    public long getGoalsCount() { return goalsCount; }
    public void setGoalsCount(long goalsCount) { this.goalsCount = goalsCount; }

    public long getReportsCount() { return reportsCount; }
    public void setReportsCount(long reportsCount) { this.reportsCount = reportsCount; }

    public LocalDateTime getMemberSince() { return memberSince; }
    public void setMemberSince(LocalDateTime memberSince) { this.memberSince = memberSince; }
}
