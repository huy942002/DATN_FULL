package com.example.backend.entities;

import jakarta.persistence.*;
@Entity
@Table(name="Product_Locations")
public class ProductLocations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ProductLocationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Locations location;

    public Integer getProductLocationId() {
        return ProductLocationId;
    }

    public void setProductLocationId(Integer productLocationId) {
        ProductLocationId = productLocationId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Locations getLocation() {
        return location;
    }

    public void setLocation(Locations location) {
        this.location = location;
    }
}
