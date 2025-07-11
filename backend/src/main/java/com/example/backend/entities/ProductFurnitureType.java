package com.example.backend.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "ProductFurnitureTypes")
public class ProductFurnitureType {

    @EmbeddedId
    private ProductFurnitureTypeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("furnitureTypeId")
    @JoinColumn(name = "furniture_type_id")
    private FurnitureType furnitureType;

    public ProductFurnitureType() {}

    public ProductFurnitureType(Product product, FurnitureType furnitureType) {
        this.product = product;
        this.furnitureType = furnitureType;
        this.id = new ProductFurnitureTypeId(product.getProductId(), furnitureType.getFurnitureTypeId());
    }

    public ProductFurnitureTypeId getId() {
        return id;
    }

    public void setId(ProductFurnitureTypeId id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public FurnitureType getFurnitureType() {
        return furnitureType;
    }

    public void setFurnitureType(FurnitureType furnitureType) {
        this.furnitureType = furnitureType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductFurnitureType that = (ProductFurnitureType) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Embeddable
    public static class ProductFurnitureTypeId implements Serializable {
        private Integer productId;
        private Integer furnitureTypeId;

        public ProductFurnitureTypeId() {}

        public ProductFurnitureTypeId(Integer productId, Integer furnitureTypeId) {
            this.productId = productId;
            this.furnitureTypeId = furnitureTypeId;
        }

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
        }

        public Integer getFurnitureTypeId() {
            return furnitureTypeId;
        }

        public void setFurnitureTypeId(Integer furnitureTypeId) {
            this.furnitureTypeId = furnitureTypeId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ProductFurnitureTypeId that = (ProductFurnitureTypeId) o;
            return Objects.equals(productId, that.productId) &&
                    Objects.equals(furnitureTypeId, that.furnitureTypeId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(productId, furnitureTypeId);
        }
    }
}
