package com.trackwise.dto;

import java.math.BigDecimal;

/**
 * SpendingTrendPoint — Represents the total expense amount for a single day,
 * used in the 30-day Spending Trend line chart widget.
 */
public class SpendingTrendPoint {

    /** ISO-8601 date string, e.g. "2025-01-15". */
    private String date;

    private BigDecimal amount;

    public SpendingTrendPoint() {
    }

    public SpendingTrendPoint(String date, BigDecimal amount) {
        this.date = date;
        this.amount = amount != null ? amount : BigDecimal.ZERO;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
