package com.trackwise.dto;

import com.trackwise.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * TransactionRequest — DTO payload for creating or updating a Transaction.
 */
public class TransactionRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be a positive value")
    private BigDecimal amount;

    @NotNull(message = "Transaction type is required")
    private TransactionType type;

    private UUID categoryId;

    private UUID accountId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    public TransactionRequest() {
    }

    public TransactionRequest(String title, BigDecimal amount, TransactionType type, UUID categoryId, LocalDate date, String description) {
        this(title, amount, type, categoryId, null, date, description);
    }

    public TransactionRequest(String title, BigDecimal amount, TransactionType type, UUID categoryId, UUID accountId, LocalDate date, String description) {
        this.title = title;
        this.amount = amount;
        this.type = type;
        this.categoryId = categoryId;
        this.accountId = accountId;
        this.date = date;
        this.description = description;
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

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public void setAccountId(UUID accountId) {
        this.accountId = accountId;
    }

    public LocalDate getDate() {
        return date;
    }


    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
