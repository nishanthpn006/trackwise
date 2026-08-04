package com.trackwise.dto;

import java.util.List;

/**
 * DashboardAnalyticsResponse — Top-level response payload for {@code GET /api/dashboard/analytics}.
 * Aggregates all four analytics data sets into a single JSON object.
 */
public class DashboardAnalyticsResponse {

    /** Last 6 months of monthly income vs expense data (oldest → newest). */
    private List<MonthlyDataPoint> monthlyData;

    /** Expense totals grouped by category, ordered by amount descending. */
    private List<CategoryBreakdownItem> categoryBreakdown;

    /** Daily expense totals for the last 30 days (oldest → newest). */
    private List<SpendingTrendPoint> spendingTrend;

    /** Aggregated KPI metrics for the financial insights card. */
    private FinancialInsights financialInsights;

    public DashboardAnalyticsResponse() {
    }

    public DashboardAnalyticsResponse(
            List<MonthlyDataPoint> monthlyData,
            List<CategoryBreakdownItem> categoryBreakdown,
            List<SpendingTrendPoint> spendingTrend,
            FinancialInsights financialInsights
    ) {
        this.monthlyData = monthlyData;
        this.categoryBreakdown = categoryBreakdown;
        this.spendingTrend = spendingTrend;
        this.financialInsights = financialInsights;
    }

    public List<MonthlyDataPoint> getMonthlyData() {
        return monthlyData;
    }

    public void setMonthlyData(List<MonthlyDataPoint> monthlyData) {
        this.monthlyData = monthlyData;
    }

    public List<CategoryBreakdownItem> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryBreakdownItem> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<SpendingTrendPoint> getSpendingTrend() {
        return spendingTrend;
    }

    public void setSpendingTrend(List<SpendingTrendPoint> spendingTrend) {
        this.spendingTrend = spendingTrend;
    }

    public FinancialInsights getFinancialInsights() {
        return financialInsights;
    }

    public void setFinancialInsights(FinancialInsights financialInsights) {
        this.financialInsights = financialInsights;
    }
}
