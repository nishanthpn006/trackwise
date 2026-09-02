package com.trackwise.dto;

import java.math.BigDecimal;
import java.util.List;

public class SubscriptionSummaryResponse {

    private BigDecimal monthlyTotal;
    private BigDecimal yearlyTotal;
    private long activeCount;
    private List<SubscriptionResponse> upcomingRenewals;

    public SubscriptionSummaryResponse() {
    }

    public SubscriptionSummaryResponse(BigDecimal monthlyTotal, BigDecimal yearlyTotal,
                                       long activeCount, List<SubscriptionResponse> upcomingRenewals) {
        this.monthlyTotal = monthlyTotal != null ? monthlyTotal : BigDecimal.ZERO;
        this.yearlyTotal = yearlyTotal != null ? yearlyTotal : BigDecimal.ZERO;
        this.activeCount = activeCount;
        this.upcomingRenewals = upcomingRenewals;
    }

    public BigDecimal getMonthlyTotal() {
        return monthlyTotal;
    }

    public void setMonthlyTotal(BigDecimal monthlyTotal) {
        this.monthlyTotal = monthlyTotal;
    }

    public BigDecimal getYearlyTotal() {
        return yearlyTotal;
    }

    public void setYearlyTotal(BigDecimal yearlyTotal) {
        this.yearlyTotal = yearlyTotal;
    }

    public long getActiveCount() {
        return activeCount;
    }

    public void setActiveCount(long activeCount) {
        this.activeCount = activeCount;
    }

    public List<SubscriptionResponse> getUpcomingRenewals() {
        return upcomingRenewals;
    }

    public void setUpcomingRenewals(List<SubscriptionResponse> upcomingRenewals) {
        this.upcomingRenewals = upcomingRenewals;
    }
}
