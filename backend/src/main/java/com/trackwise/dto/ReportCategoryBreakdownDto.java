package com.trackwise.dto;

import java.math.BigDecimal;

public class ReportCategoryBreakdownDto {
    private String categoryName;
    private String icon;
    private String color;
    private BigDecimal amount;
    private BigDecimal percentage;
    private long transactionCount;

    public ReportCategoryBreakdownDto() {
    }

    public ReportCategoryBreakdownDto(String categoryName, String icon, String color, BigDecimal amount, BigDecimal percentage, long transactionCount) {
        this.categoryName = categoryName;
        this.icon = icon;
        this.color = color;
        this.amount = amount != null ? amount : BigDecimal.ZERO;
        this.percentage = percentage != null ? percentage : BigDecimal.ZERO;
        this.transactionCount = transactionCount;
    }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }

    public long getTransactionCount() { return transactionCount; }
    public void setTransactionCount(long transactionCount) { this.transactionCount = transactionCount; }
}
