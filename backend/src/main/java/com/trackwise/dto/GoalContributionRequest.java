package com.trackwise.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GoalContributionRequest {

    @NotNull(message = "Contribution amount is required")
    @Positive(message = "Contribution amount must be positive")
    private BigDecimal amount;

    private LocalDate date;
    private String notes;

    public GoalContributionRequest() {
    }

    public GoalContributionRequest(BigDecimal amount, LocalDate date, String notes) {
        this.amount = amount;
        this.date = date;
        this.notes = notes;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
