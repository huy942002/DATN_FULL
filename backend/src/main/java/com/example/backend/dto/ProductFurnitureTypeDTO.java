package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ProductFurnitureTypeDTO {
    @NotNull(message = "Furniture Type ID is required")
    private Integer furnitureTypeId;

    // Getters and setters
    public Integer getFurnitureTypeId() { return furnitureTypeId; }
    public void setFurnitureTypeId(Integer furnitureTypeId) { this.furnitureTypeId = furnitureTypeId; }
}