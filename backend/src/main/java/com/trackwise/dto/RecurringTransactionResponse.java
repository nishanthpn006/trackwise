package com.trackwise.dto;

import com.trackwise.entity.RecurrenceFrequency;
import com.trackwise.entity.RecurringTransaction;
import com.trackwise.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class RecurringTransactionResponse {

    private UUID id;
    private String title;
    private BigDecimal amount;
    private TransactionType type;
    private RecurrenceFrequency frequency;
    private LocalDate startDate;
    private LocalDate nextExecutionDate;
    private LocalDate endDate;
    private LocalDateTime lastExecutedAt;
    private boolean isActive;
    private String description;
    private CategoryResponse category;
    private AccountResponse account;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RecurringTransactionResponse() {
    }

    public static RecurringTransactionResponse fromEntity(RecurringTransaction rt) {
        if (rt == null) return null;
        RecurringTransactionResponse resp = new RecurringTransactionResponse();
        resp.id = rt.getId();
        resp.title = rt.getTitle();
        resp.amount = rt.getAmount();
        resp.type = rt.getType();
        resp.frequency = rt.getFrequency();
        resp.startDate = rt.getStartDate();
        resp.nextExecutionDate = rt.getNextExecutionDate();
        resp.endDate = rt.getEndDate();
        resp.lastExecutedAt = rt.getLastExecutedAt();
        resp.isActive = rt.isActive();
        resp.description = rt.getDescription();
        resp.category = CategoryResponse.fromEntity(rt.getCategory());
        resp.account = AccountResponse.fromEntity(rt.getAccount());
        resp.createdAt = rt.getCreatedAt();
        resp.updatedAt = rt.getUpdatedAt();
        return resp;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public RecurrenceFrequency getFrequency() {
        return frequency;
    }

    public void setFrequency(RecurrenceFrequency frequency) {
        this.frequency = frequency;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getNextExecutionDate() {
        return nextExecutionDate;
    }

    public void setNextExecutionDate(LocalDate nextExecutionDate) {
        this.nextExecutionDate = nextExecutionDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getLastExecutedAt() {
        return lastExecutedAt;
    }

    public void setLastExecutedAt(LocalDateTime lastExecutedAt) {
        this.lastExecutedAt = lastExecutedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CategoryResponse getCategory() {
        return category;
    }

    public void setCategory(CategoryResponse category) {
        this.category = category;
    }

    public AccountResponse getAccount() {
        return account;
    }

    public void setAccount(AccountResponse account) {
        this.account = account;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
