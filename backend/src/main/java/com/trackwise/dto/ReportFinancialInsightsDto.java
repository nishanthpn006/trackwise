package com.trackwise.dto;

import java.math.BigDecimal;

public class ReportFinancialInsightsDto {
    private String highestCategoryName;
    private BigDecimal highestCategoryAmount;
    private String largestExpenseTitle;
    private BigDecimal largestExpenseAmount;
    private String largestIncomeTitle;
    private BigDecimal largestIncomeAmount;
    private BigDecimal averageMonthlySavings;
    private String bestSavingsMonth;
    private String worstSpendingMonth;
    private String budgetStatusMessage;
    private String goalProgressMessage;

    public ReportFinancialInsightsDto() {
    }

    public ReportFinancialInsightsDto(String highestCategoryName, BigDecimal highestCategoryAmount,
                                      String largestExpenseTitle, BigDecimal largestExpenseAmount,
                                      String largestIncomeTitle, BigDecimal largestIncomeAmount,
                                      BigDecimal averageMonthlySavings, String bestSavingsMonth,
                                      String worstSpendingMonth, String budgetStatusMessage, String goalProgressMessage) {
        this.highestCategoryName = highestCategoryName;
        this.highestCategoryAmount = highestCategoryAmount != null ? highestCategoryAmount : BigDecimal.ZERO;
        this.largestExpenseTitle = largestExpenseTitle;
        this.largestExpenseAmount = largestExpenseAmount != null ? largestExpenseAmount : BigDecimal.ZERO;
        this.largestIncomeTitle = largestIncomeTitle;
        this.largestIncomeAmount = largestIncomeAmount != null ? largestIncomeAmount : BigDecimal.ZERO;
        this.averageMonthlySavings = averageMonthlySavings != null ? averageMonthlySavings : BigDecimal.ZERO;
        this.bestSavingsMonth = bestSavingsMonth;
        this.worstSpendingMonth = worstSpendingMonth;
        this.budgetStatusMessage = budgetStatusMessage;
        this.goalProgressMessage = goalProgressMessage;
    }

    public String getHighestCategoryName() { return highestCategoryName; }
    public void setHighestCategoryName(String highestCategoryName) { this.highestCategoryName = highestCategoryName; }

    public BigDecimal getHighestCategoryAmount() { return highestCategoryAmount; }
    public void setHighestCategoryAmount(BigDecimal highestCategoryAmount) { this.highestCategoryAmount = highestCategoryAmount; }

    public String getLargestExpenseTitle() { return largestExpenseTitle; }
    public void setLargestExpenseTitle(String largestExpenseTitle) { this.largestExpenseTitle = largestExpenseTitle; }

    public BigDecimal getLargestExpenseAmount() { return largestExpenseAmount; }
    public void setLargestExpenseAmount(BigDecimal largestExpenseAmount) { this.largestExpenseAmount = largestExpenseAmount; }

    public String getLargestIncomeTitle() { return largestIncomeTitle; }
    public void setLargestIncomeTitle(String largestIncomeTitle) { this.largestIncomeTitle = largestIncomeTitle; }

    public BigDecimal getLargestIncomeAmount() { return largestIncomeAmount; }
    public void setLargestIncomeAmount(BigDecimal largestIncomeAmount) { this.largestIncomeAmount = largestIncomeAmount; }

    public BigDecimal getAverageMonthlySavings() { return averageMonthlySavings; }
    public void setAverageMonthlySavings(BigDecimal averageMonthlySavings) { this.averageMonthlySavings = averageMonthlySavings; }

    public String getBestSavingsMonth() { return bestSavingsMonth; }
    public void setBestSavingsMonth(String bestSavingsMonth) { this.bestSavingsMonth = bestSavingsMonth; }

    public String getWorstSpendingMonth() { return worstSpendingMonth; }
    public void setWorstSpendingMonth(String worstSpendingMonth) { this.worstSpendingMonth = worstSpendingMonth; }

    public String getBudgetStatusMessage() { return budgetStatusMessage; }
    public void setBudgetStatusMessage(String budgetStatusMessage) { this.budgetStatusMessage = budgetStatusMessage; }

    public String getGoalProgressMessage() { return goalProgressMessage; }
    public void setGoalProgressMessage(String goalProgressMessage) { this.goalProgressMessage = goalProgressMessage; }
}
