package com.trackwise.dto;

import com.trackwise.entity.GoalContribution;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class GoalContributionResponse {

    private UUID id;
    private UUID goalId;
    private BigDecimal amount;
    private LocalDate date;
    private String notes;
    private LocalDateTime createdAt;

    public GoalContributionResponse() {
    }

    public GoalContributionResponse(GoalContribution contribution) {
        this.id = contribution.getId();
        this.goalId = contribution.getGoal() != null ? contribution.getGoal().getId() : null;
        this.amount = contribution.getAmount();
        this.date = contribution.getDate();
        this.notes = contribution.getNotes();
        this.createdAt = contribution.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getGoalId() { return goalId; }
    public void setGoalId(UUID goalId) { this.goalId = goalId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
