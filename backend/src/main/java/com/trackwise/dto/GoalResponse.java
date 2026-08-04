package com.trackwise.dto;

import com.trackwise.entity.Goal;
import com.trackwise.entity.GoalStatus;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class GoalResponse {

    private UUID id;
    private String name;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private BigDecimal remainingAmount;
    private BigDecimal completionPercentage;
    private LocalDate targetDate;
    private String category;
    private String icon;
    private String color;
    private String description;
    private GoalStatus status;
    private long daysRemaining;
    private List<GoalContributionResponse> contributions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public GoalResponse() {
    }

    public GoalResponse(Goal goal) {
        this.id = goal.getId();
        this.name = goal.getName();
        this.targetAmount = goal.getTargetAmount() != null ? goal.getTargetAmount() : BigDecimal.ZERO;
        this.currentAmount = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : BigDecimal.ZERO;
        this.targetDate = goal.getTargetDate();
        this.category = goal.getCategory();
        this.icon = goal.getIcon();
        this.color = goal.getColor();
        this.description = goal.getDescription();
        this.createdAt = goal.getCreatedAt();
        this.updatedAt = goal.getUpdatedAt();

        if (goal.getContributions() != null) {
            this.contributions = goal.getContributions().stream()
                    .map(GoalContributionResponse::new)
                    .collect(Collectors.toList());
        }

        // Calculations
        BigDecimal rem = this.targetAmount.subtract(this.currentAmount);
        this.remainingAmount = rem.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : rem;

        if (this.targetAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.completionPercentage = this.currentAmount
                    .multiply(BigDecimal.valueOf(100))
                    .divide(this.targetAmount, 2, RoundingMode.HALF_UP);
            if (this.completionPercentage.compareTo(BigDecimal.valueOf(100)) > 0) {
                this.completionPercentage = BigDecimal.valueOf(100);
            }
        } else {
            this.completionPercentage = BigDecimal.ZERO;
        }

        LocalDate today = LocalDate.now();
        if (this.targetDate != null) {
            this.daysRemaining = ChronoUnit.DAYS.between(today, this.targetDate);
        } else {
            this.daysRemaining = 0;
        }

        // Status determination
        if (this.currentAmount.compareTo(this.targetAmount) >= 0) {
            this.status = GoalStatus.COMPLETED;
        } else if (this.targetDate != null && this.targetDate.isBefore(today)) {
            this.status = GoalStatus.OVERDUE;
        } else if (this.currentAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.status = GoalStatus.NOT_STARTED;
        } else {
            BigDecimal eightyFivePct = this.targetAmount.multiply(BigDecimal.valueOf(0.85));
            if (this.currentAmount.compareTo(eightyFivePct) >= 0) {
                this.status = GoalStatus.ALMOST_COMPLETE;
            } else {
                this.status = GoalStatus.IN_PROGRESS;
            }
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public BigDecimal getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(BigDecimal currentAmount) { this.currentAmount = currentAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public BigDecimal getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(BigDecimal completionPercentage) { this.completionPercentage = completionPercentage; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }

    public long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }

    public List<GoalContributionResponse> getContributions() { return contributions; }
    public void setContributions(List<GoalContributionResponse> contributions) { this.contributions = contributions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
