package com.trackwise.dto;

import com.trackwise.entity.BillingCycle;
import com.trackwise.entity.Subscription;
import com.trackwise.entity.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class SubscriptionResponse {

    private UUID id;
    private String name;
    private BigDecimal amount;
    private BillingCycle billingCycle;
    private LocalDate nextBillingDate;
    private SubscriptionStatus status;
    private String description;
    private Integer reminderDaysBefore;
    private CategoryResponse category;
    private AccountResponse account;
    private long daysUntilBilling;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SubscriptionResponse() {
    }

    public static SubscriptionResponse fromEntity(Subscription sub) {
        if (sub == null) return null;
        SubscriptionResponse resp = new SubscriptionResponse();
        resp.id = sub.getId();
        resp.name = sub.getName();
        resp.amount = sub.getAmount();
        resp.billingCycle = sub.getBillingCycle();
        resp.nextBillingDate = sub.getNextBillingDate();
        resp.status = sub.getStatus();
        resp.description = sub.getDescription();
        resp.reminderDaysBefore = sub.getReminderDaysBefore();
        resp.category = CategoryResponse.fromEntity(sub.getCategory());
        resp.account = AccountResponse.fromEntity(sub.getAccount());
        if (sub.getNextBillingDate() != null) {
            resp.daysUntilBilling = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), sub.getNextBillingDate());
        }
        resp.createdAt = sub.getCreatedAt();
        resp.updatedAt = sub.getUpdatedAt();
        return resp;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BillingCycle getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(BillingCycle billingCycle) {
        this.billingCycle = billingCycle;
    }

    public LocalDate getNextBillingDate() {
        return nextBillingDate;
    }

    public void setNextBillingDate(LocalDate nextBillingDate) {
        this.nextBillingDate = nextBillingDate;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getReminderDaysBefore() {
        return reminderDaysBefore;
    }

    public void setReminderDaysBefore(Integer reminderDaysBefore) {
        this.reminderDaysBefore = reminderDaysBefore;
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

    public long getDaysUntilBilling() {
        return daysUntilBilling;
    }

    public void setDaysUntilBilling(long daysUntilBilling) {
        this.daysUntilBilling = daysUntilBilling;
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
