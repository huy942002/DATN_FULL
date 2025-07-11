package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ProductCategoryDTO {
    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    // Getters and setters
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
}
