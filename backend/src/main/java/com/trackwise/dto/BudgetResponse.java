package com.trackwise.dto;

import com.trackwise.entity.Budget;
import com.trackwise.entity.BudgetPeriod;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * BudgetResponse — DTO returned to clients, including the computed `spent`
 * amount (sum of matching transactions in the budget's date range).
 */
public class BudgetResponse {

    private UUID id;
    private String name;
    private BigDecimal amount;
    private BigDecimal spent;
    private BudgetPeriod period;
    private LocalDate startDate;
    private LocalDate endDate;

    /** Null when no category is linked. */
    private UUID categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BudgetResponse() {
    }

    /**
     * Static factory — builds from entity + externally computed spent value.
     */
    public static BudgetResponse fromEntity(Budget budget, BigDecimal spent) {
        BudgetResponse dto = new BudgetResponse();
        dto.id = budget.getId();
        dto.name = budget.getName();
        dto.amount = budget.getAmount();
        dto.spent = spent != null ? spent : BigDecimal.ZERO;
        dto.period = budget.getPeriod();
        dto.startDate = budget.getStartDate();
        dto.endDate = budget.getEndDate();
        dto.createdAt = budget.getCreatedAt();
        dto.updatedAt = budget.getUpdatedAt();

        if (budget.getCategory() != null) {
            dto.categoryId = budget.getCategory().getId();
            dto.categoryName = budget.getCategory().getName();
            dto.categoryColor = budget.getCategory().getColor();
            dto.categoryIcon = budget.getCategory().getIcon();
        }

        return dto;
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getSpent() { return spent; }
    public void setSpent(BigDecimal spent) { this.spent = spent; }

    public BudgetPeriod getPeriod() { return period; }
    public void setPeriod(BudgetPeriod period) { this.period = period; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryColor() { return categoryColor; }
    public void setCategoryColor(String categoryColor) { this.categoryColor = categoryColor; }

    public String getCategoryIcon() { return categoryIcon; }
    public void setCategoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
