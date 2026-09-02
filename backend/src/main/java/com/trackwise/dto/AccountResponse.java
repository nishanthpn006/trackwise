package com.trackwise.dto;

import com.trackwise.entity.Account;
import com.trackwise.entity.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class AccountResponse {

    private UUID id;
    private String name;
    private AccountType type;
    private BigDecimal initialBalance;
    private BigDecimal currentBalance;
    private String currency;
    private String color;
    private String icon;
    private String description;
    private boolean isArchived;
    private long transactionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AccountResponse() {
    }

    public static AccountResponse fromEntity(Account account) {
        return fromEntity(account, 0L);
    }

    public static AccountResponse fromEntity(Account account, long transactionCount) {
        if (account == null) return null;
        AccountResponse resp = new AccountResponse();
        resp.id = account.getId();
        resp.name = account.getName();
        resp.type = account.getType();
        resp.initialBalance = account.getInitialBalance();
        resp.currentBalance = account.getCurrentBalance();
        resp.currency = account.getCurrency();
        resp.color = account.getColor();
        resp.icon = account.getIcon();
        resp.description = account.getDescription();
        resp.isArchived = account.isArchived();
        resp.transactionCount = transactionCount;
        resp.createdAt = account.getCreatedAt();
        resp.updatedAt = account.getUpdatedAt();
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

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public BigDecimal getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }

    public BigDecimal getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(BigDecimal currentBalance) {
        this.currentBalance = currentBalance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isArchived() {
        return isArchived;
    }

    public void setArchived(boolean archived) {
        isArchived = archived;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
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
