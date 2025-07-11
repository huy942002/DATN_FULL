package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDetailsDTO {
    private Integer productDetailsId;
    private Integer colorId;

    @Min(value = 0, message = "Price must be non-negative")
    private BigDecimal price;

    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;

    private Boolean active;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;

    private String sku;

    private String barcode;

    @NotBlank(message = "Meta Tag Title must not be blank")
    @Size(max = 100, message = "Meta Tag Title must not exceed 100 characters")
    private String metaTagTitle;

    @Size(max = 255, message = "Meta Tag Description must not exceed 255 characters")
    private String metaTagDescription;

    @Size(max = 255, message = "Meta Keywords must not exceed 255 characters")
    private String metaKeywords;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and setters
    public Integer getProductDetailsId() { return productDetailsId; }
    public void setProductDetailsId(Integer productDetailsId) { this.productDetailsId = productDetailsId; }
    public Integer getColorId() { return colorId; }
    public void setColorId(Integer colorId) { this.colorId = colorId; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public Boolean isActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
    public String getMetaTagTitle() { return metaTagTitle; }
    public void setMetaTagTitle(String metaTagTitle) { this.metaTagTitle = metaTagTitle; }
    public String getMetaTagDescription() { return metaTagDescription; }
    public void setMetaTagDescription(String metaTagDescription) { this.metaTagDescription = metaTagDescription; }
    public String getMetaKeywords() { return metaKeywords; }
    public void setMetaKeywords(String metaKeywords) { this.metaKeywords = metaKeywords; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}