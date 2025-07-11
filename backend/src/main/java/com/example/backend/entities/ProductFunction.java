package com.example.backend.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "ProductFunctions")
public class ProductFunction {

    @EmbeddedId
    private ProductFunctionId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("functionId")
    @JoinColumn(name = "function_id")
    private Functions function;

    public ProductFunction() {}

    public ProductFunction(Product product, Functions function) {
        this.product = product;
        this.function = function;
        this.id = new ProductFunctionId(product.getProductId(), function.getFunctionId());
    }

    public ProductFunctionId getId() {
        return id;
    }

    public void setId(ProductFunctionId id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Functions getFunction() {
        return function;
    }

    public void setFunction(Functions function) {
        this.function = function;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductFunction that = (ProductFunction) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Embeddable
    public static class ProductFunctionId implements Serializable {
        private Integer productId;
        private Integer functionId;

        public ProductFunctionId() {}

        public ProductFunctionId(Integer productId, Integer functionId) {
            this.productId = productId;
            this.functionId = functionId;
        }

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
        }

        public Integer getFunctionId() {
            return functionId;
        }

        public void setFunctionId(Integer functionId) {
            this.functionId = functionId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ProductFunctionId that = (ProductFunctionId) o;
            return Objects.equals(productId, that.productId) &&
                    Objects.equals(functionId, that.functionId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(productId, functionId);
        }
    }
}