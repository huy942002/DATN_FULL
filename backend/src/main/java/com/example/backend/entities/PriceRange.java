package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "PriceRange")
@EntityListeners(AuditingEntityListener.class)
public class PriceRange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer priceRangeId;

    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(100)")
    @NotBlank(message = "Price range name is required")
    private String priceRangeName;

    @Column(columnDefinition = "NVARCHAR(500)", nullable = true)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "active", nullable = false)
    private boolean isActive = true;

    public PriceRange() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Integer getPriceRangeId() {
        return priceRangeId;
    }

    public void setPriceRangeId(Integer priceRangeId) {
        this.priceRangeId = priceRangeId;
    }

    public String getPriceRangeName() {
        return priceRangeName;
    }

    public void setPriceRangeName(String priceRangeName) {
        this.priceRangeName = priceRangeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    // Note: Consider adding index on priceRangeName for faster lookups
    // CREATE INDEX idx_price_range_name ON PriceRanges(priceRangeName);
}