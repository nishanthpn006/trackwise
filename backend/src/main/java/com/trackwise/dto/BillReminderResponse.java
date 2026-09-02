package com.trackwise.dto;

import com.trackwise.entity.BillReminder;
import com.trackwise.entity.BillStatus;
import com.trackwise.entity.RecurrenceFrequency;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class BillReminderResponse {

    private UUID id;
    private String title;
    private BigDecimal amount;
    private LocalDate dueDate;
    private RecurrenceFrequency frequency;
    private BillStatus status;
    private LocalDateTime paidAt;
    private String notes;
    private CategoryResponse category;
    private AccountResponse account;
    private long daysUntilDue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BillReminderResponse() {
    }

    public static BillReminderResponse fromEntity(BillReminder bill) {
        if (bill == null) return null;
        BillReminderResponse resp = new BillReminderResponse();
        resp.id = bill.getId();
        resp.title = bill.getTitle();
        resp.amount = bill.getAmount();
        resp.dueDate = bill.getDueDate();
        resp.frequency = bill.getFrequency();
        resp.status = bill.getStatus();
        resp.paidAt = bill.getPaidAt();
        resp.notes = bill.getNotes();
        resp.category = CategoryResponse.fromEntity(bill.getCategory());
        resp.account = AccountResponse.fromEntity(bill.getAccount());
        if (bill.getDueDate() != null) {
            resp.daysUntilDue = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), bill.getDueDate());
        }
        resp.createdAt = bill.getCreatedAt();
        resp.updatedAt = bill.getUpdatedAt();
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

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public RecurrenceFrequency getFrequency() {
        return frequency;
    }

    public void setFrequency(RecurrenceFrequency frequency) {
        this.frequency = frequency;
    }

    public BillStatus getStatus() {
        return status;
    }

    public void setStatus(BillStatus status) {
        this.status = status;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public long getDaysUntilDue() {
        return daysUntilDue;
    }

    public void setDaysUntilDue(long daysUntilDue) {
        this.daysUntilDue = daysUntilDue;
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
