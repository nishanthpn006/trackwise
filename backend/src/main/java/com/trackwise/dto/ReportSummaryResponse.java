package com.trackwise.dto;

import java.math.BigDecimal;
import java.util.List;

public class ReportSummaryResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private BigDecimal averageDailySpend;
    private BigDecimal averageMonthlySpend;
    private BigDecimal largestExpense;
    private BigDecimal largestIncome;
    private long transactionsCount;
    private BigDecimal savingsRatePercentage;
    private BigDecimal budgetUtilizationPercentage;

    private List<ReportCategoryBreakdownDto> categoryBreakdown;
    private List<ReportTrendPointDto> incomeVsExpenseTrend;
    private List<ReportTrendPointDto> cashFlowTrend;
    private List<ReportTrendPointDto> spendingTrend;
    private ReportBudgetAnalyticsDto budgetAnalytics;
    private ReportGoalAnalyticsDto goalAnalytics;
    private List<ReportCategoryBreakdownDto> topCategories;
    private ReportFinancialInsightsDto insights;
    private List<ReportTrendPointDto> monthlyBreakdown;

    public ReportSummaryResponse() {
    }

    public ReportSummaryResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal netSavings,
                                 BigDecimal averageDailySpend, BigDecimal averageMonthlySpend,
                                 BigDecimal largestExpense, BigDecimal largestIncome, long transactionsCount,
                                 BigDecimal savingsRatePercentage, BigDecimal budgetUtilizationPercentage,
                                 List<ReportCategoryBreakdownDto> categoryBreakdown,
                                 List<ReportTrendPointDto> incomeVsExpenseTrend,
                                 List<ReportTrendPointDto> cashFlowTrend,
                                 List<ReportTrendPointDto> spendingTrend,
                                 ReportBudgetAnalyticsDto budgetAnalytics,
                                 ReportGoalAnalyticsDto goalAnalytics,
                                 List<ReportCategoryBreakdownDto> topCategories,
                                 ReportFinancialInsightsDto insights,
                                 List<ReportTrendPointDto> monthlyBreakdown) {
        this.totalIncome = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        this.totalExpenses = totalExpenses != null ? totalExpenses : BigDecimal.ZERO;
        this.netSavings = netSavings != null ? netSavings : BigDecimal.ZERO;
        this.averageDailySpend = averageDailySpend != null ? averageDailySpend : BigDecimal.ZERO;
        this.averageMonthlySpend = averageMonthlySpend != null ? averageMonthlySpend : BigDecimal.ZERO;
        this.largestExpense = largestExpense != null ? largestExpense : BigDecimal.ZERO;
        this.largestIncome = largestIncome != null ? largestIncome : BigDecimal.ZERO;
        this.transactionsCount = transactionsCount;
        this.savingsRatePercentage = savingsRatePercentage != null ? savingsRatePercentage : BigDecimal.ZERO;
        this.budgetUtilizationPercentage = budgetUtilizationPercentage != null ? budgetUtilizationPercentage : BigDecimal.ZERO;
        this.categoryBreakdown = categoryBreakdown;
        this.incomeVsExpenseTrend = incomeVsExpenseTrend;
        this.cashFlowTrend = cashFlowTrend;
        this.spendingTrend = spendingTrend;
        this.budgetAnalytics = budgetAnalytics;
        this.goalAnalytics = goalAnalytics;
        this.topCategories = topCategories;
        this.insights = insights;
        this.monthlyBreakdown = monthlyBreakdown;
    }

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public BigDecimal getNetSavings() { return netSavings; }
    public void setNetSavings(BigDecimal netSavings) { this.netSavings = netSavings; }

    public BigDecimal getAverageDailySpend() { return averageDailySpend; }
    public void setAverageDailySpend(BigDecimal averageDailySpend) { this.averageDailySpend = averageDailySpend; }

    public BigDecimal getAverageMonthlySpend() { return averageMonthlySpend; }
    public void setAverageMonthlySpend(BigDecimal averageMonthlySpend) { this.averageMonthlySpend = averageMonthlySpend; }

    public BigDecimal getLargestExpense() { return largestExpense; }
    public void setLargestExpense(BigDecimal largestExpense) { this.largestExpense = largestExpense; }

    public BigDecimal getLargestIncome() { return largestIncome; }
    public void setLargestIncome(BigDecimal largestIncome) { this.largestIncome = largestIncome; }

    public long getTransactionsCount() { return transactionsCount; }
    public void setTransactionsCount(long transactionsCount) { this.transactionsCount = transactionsCount; }

    public BigDecimal getSavingsRatePercentage() { return savingsRatePercentage; }
    public void setSavingsRatePercentage(BigDecimal savingsRatePercentage) { this.savingsRatePercentage = savingsRatePercentage; }

    public BigDecimal getBudgetUtilizationPercentage() { return budgetUtilizationPercentage; }
    public void setBudgetUtilizationPercentage(BigDecimal budgetUtilizationPercentage) { this.budgetUtilizationPercentage = budgetUtilizationPercentage; }

    public List<ReportCategoryBreakdownDto> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<ReportCategoryBreakdownDto> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<ReportTrendPointDto> getIncomeVsExpenseTrend() { return incomeVsExpenseTrend; }
    public void setIncomeVsExpenseTrend(List<ReportTrendPointDto> incomeVsExpenseTrend) { this.incomeVsExpenseTrend = incomeVsExpenseTrend; }

    public List<ReportTrendPointDto> getCashFlowTrend() { return cashFlowTrend; }
    public void setCashFlowTrend(List<ReportTrendPointDto> cashFlowTrend) { this.cashFlowTrend = cashFlowTrend; }

    public List<ReportTrendPointDto> getSpendingTrend() { return spendingTrend; }
    public void setSpendingTrend(List<ReportTrendPointDto> spendingTrend) { this.spendingTrend = spendingTrend; }

    public ReportBudgetAnalyticsDto getBudgetAnalytics() { return budgetAnalytics; }
    public void setBudgetAnalytics(ReportBudgetAnalyticsDto budgetAnalytics) { this.budgetAnalytics = budgetAnalytics; }

    public ReportGoalAnalyticsDto getGoalAnalytics() { return goalAnalytics; }
    public void setGoalAnalytics(ReportGoalAnalyticsDto goalAnalytics) { this.goalAnalytics = goalAnalytics; }

    public List<ReportCategoryBreakdownDto> getTopCategories() { return topCategories; }
    public void setTopCategories(List<ReportCategoryBreakdownDto> topCategories) { this.topCategories = topCategories; }

    public ReportFinancialInsightsDto getInsights() { return insights; }
    public void setInsights(ReportFinancialInsightsDto insights) { this.insights = insights; }

    public List<ReportTrendPointDto> getMonthlyBreakdown() { return monthlyBreakdown; }
    public void setMonthlyBreakdown(List<ReportTrendPointDto> monthlyBreakdown) { this.monthlyBreakdown = monthlyBreakdown; }
}
