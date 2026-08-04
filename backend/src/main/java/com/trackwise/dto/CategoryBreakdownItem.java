package com.trackwise.dto;

import java.math.BigDecimal;

/**
 * CategoryBreakdownItem — Represents a single category's share of total expenses
 * for the Expense by Category pie/donut chart widget.
 */
public class CategoryBreakdownItem {

    /** Display name of the category (or "Uncategorized" if null). */
    private String categoryName;

    /** Hex colour string from the Category entity; falls back to a palette colour if absent. */
    private String color;

    private BigDecimal amount;

    /** Percentage of total expenses this category represents (0–100, rounded to 1 dp). */
    private BigDecimal percentage;

    public CategoryBreakdownItem() {
    }

    public CategoryBreakdownItem(String categoryName, String color, BigDecimal amount, BigDecimal percentage) {
        this.categoryName = categoryName;
        this.color = color;
        this.amount = amount != null ? amount : BigDecimal.ZERO;
        this.percentage = percentage != null ? percentage : BigDecimal.ZERO;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }
}
