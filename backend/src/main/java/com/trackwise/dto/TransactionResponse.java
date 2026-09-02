package com.trackwise.dto;

import com.trackwise.entity.Transaction;
import com.trackwise.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * TransactionResponse — DTO payload returned to clients for Transaction objects.
 */
public class TransactionResponse {

    private UUID id;
    private String title;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
    private LocalDate date;
    private CategoryResponse category;
    private AccountResponse account;
    private LocalDateTime createdAt;

    public TransactionResponse() {
    }

    public TransactionResponse(UUID id, String title, BigDecimal amount, TransactionType type,
                               String description, LocalDate date, CategoryResponse category,
                               LocalDateTime createdAt) {
        this(id, title, amount, type, description, date, category, null, createdAt);
    }

    public TransactionResponse(UUID id, String title, BigDecimal amount, TransactionType type,
                               String description, LocalDate date, CategoryResponse category,
                               AccountResponse account, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.date = date;
        this.category = category;
        this.account = account;
        this.createdAt = createdAt;
    }


    public static TransactionResponse fromEntity(Transaction transaction) {
        if (transaction == null) return null;
        return new TransactionResponse(
                transaction.getId(),
                transaction.getTitle(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDescription(),
                transaction.getDate(),
                CategoryResponse.fromEntity(transaction.getCategory()),
                AccountResponse.fromEntity(transaction.getAccount()),
                transaction.getCreatedAt()
        );
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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
}
