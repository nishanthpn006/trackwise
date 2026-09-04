package com.trackwise.dto;

import com.trackwise.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * CategoryRequest — DTO payload for creating or updating a Category.
 */
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    private String name;

    @NotNull(message = "Transaction type is required")
    private TransactionType type;

    private String icon;

    private String color;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    public CategoryRequest() {
    }

    public CategoryRequest(String name, TransactionType type, String icon, String color) {
        this(name, type, icon, color, null);
    }

    public CategoryRequest(String name, TransactionType type, String icon, String color, String description) {
        this.name = name;
        this.type = type;
        this.icon = icon;
        this.color = color;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
