package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ProductLocationsDTO {
    @NotNull(message = "ProductLocations ID is required")
    private Integer locationId;

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }
}
