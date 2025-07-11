package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDTO {
    private Integer productId;

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name must not exceed 200 characters")
    private String productName;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Min(value = 0, message = "Price must be non-negative")
    private BigDecimal price;

    @Min(value = 0, message = "Weight must be non-negative")
    private BigDecimal weight;

    @Size(max = 100, message = "Dimensions must not exceed 100 characters")
    private String dimensions;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;

    private Integer styleId;
    private Integer woodTypeId;
    private Integer techniqueId;
    private Integer priceRangeId;

    private Integer supplierId;

    @Size(max = 50, message = "Product status must not exceed 50 characters")
    private String productStatus;

    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer ratingCount;
    private BigDecimal discountedPrice;
    private List<ProductLocationsDTO> productLocations;
    private List<ProductDetailsDTO> productDetails;
    private List<ProductImageDTO> images;
    private List<ProductCategoryDTO> categories;
    private List<ProductFurnitureTypeDTO> furnitureTypes;
    private List<ProductFunctionDTO> functions;
    private DiscountDTO discount;

    // Getters and setters
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }
    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getStyleId() { return styleId; }
    public void setStyleId(Integer styleId) { this.styleId = styleId; }
    public Integer getWoodTypeId() { return woodTypeId; }
    public void setWoodTypeId(Integer woodTypeId) { this.woodTypeId = woodTypeId; }

    public List<ProductLocationsDTO> getProductLocations() {
        return productLocations;
    }

    public void setProductLocations(List<ProductLocationsDTO> productLocations) {
        this.productLocations = productLocations;
    }

    public Integer getTechniqueId() { return techniqueId; }
    public void setTechniqueId(Integer techniqueId) { this.techniqueId = techniqueId; }
    public Integer getPriceRangeId() { return priceRangeId; }
    public void setPriceRangeId(Integer priceRangeId) { this.priceRangeId = priceRangeId; }
    public String getProductStatus() { return productStatus; }
    public void setProductStatus(String productStatus) { this.productStatus = productStatus; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ProductDetailsDTO> getProductDetails() {
        return productDetails;
    }

    public void setProductDetails(List<ProductDetailsDTO> productDetails) {
        this.productDetails = productDetails;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }

    public BigDecimal getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public List<ProductImageDTO> getImages() { return images; }
    public void setImages(List<ProductImageDTO> images) { this.images = images; }
    public List<ProductCategoryDTO> getCategories() { return categories; }
    public void setCategories(List<ProductCategoryDTO> categories) { this.categories = categories; }
    public List<ProductFurnitureTypeDTO> getFurnitureTypes() { return furnitureTypes; }
    public void setFurnitureTypes(List<ProductFurnitureTypeDTO> furnitureTypes) { this.furnitureTypes = furnitureTypes; }
    public List<ProductFunctionDTO> getFunctions() { return functions; }
    public void setFunctions(List<ProductFunctionDTO> functions) { this.functions = functions; }
    public DiscountDTO getDiscount() { return discount; }
    public void setDiscount(DiscountDTO discount) { this.discount = discount; }
    public Integer getSupplierId() { return supplierId; }
    public void setSupplierId(Integer supplierId) { this.supplierId = supplierId; }
}