package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ProductFunctionDTO {
    @NotNull(message = "Function ID is required")
    private Integer functionId;

    // Getters and setters
    public Integer getFunctionId() { return functionId; }
    public void setFunctionId(Integer functionId) { this.functionId = functionId; }
}
