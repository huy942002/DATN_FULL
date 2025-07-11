package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.ToString;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho giao dịch nhập/xuất kho.
 */
@Entity
@Table(name = "StockMovements")
@ToString
@EntityListeners(AuditingEntityListener.class)
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stockMovementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_details_id")
    private ProductDetails productDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @Column(columnDefinition = "NVARCHAR(50)", nullable = true)
    private String zone;

    @Column(columnDefinition = "NVARCHAR(50)", nullable = true)
    private String shelf;

    @Column(nullable = false)
    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private MovementType movementType;

    @Column(nullable = false)
    private LocalDateTime movementDate;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = true)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "active", nullable = false)
    private boolean isActive = true;

    public enum MovementType {
        IN, OUT, ADJUSTMENT
    }

    public StockMovement() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        movementDate = LocalDateTime.now();
    }

    // Getters và setters

    public Integer getStockMovementId() {
        return stockMovementId;
    }

    public void setStockMovementId(Integer stockMovementId) {
        this.stockMovementId = stockMovementId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductDetails getProductDetails() {
        return productDetails;
    }

    public void setProductDetails(ProductDetails productDetails) {
        this.productDetails = productDetails;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getShelf() {
        return shelf;
    }

    public void setShelf(String shelf) {
        this.shelf = shelf;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public MovementType getMovementType() {
        return movementType;
    }

    public void setMovementType(MovementType movementType) {
        this.movementType = movementType;
    }

    public LocalDateTime getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDateTime movementDate) {
        this.movementDate = movementDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}