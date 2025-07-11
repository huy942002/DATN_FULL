package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "WoodType")
public class WoodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer woodTypeId;

    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(100)")
    @NotBlank(message = "Wood type name is required")
    private String woodTypeName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "material_id", nullable = false)
    private Material materials;

    @Column(columnDefinition = "NVARCHAR(500)", nullable = true)
    private String description;

    @Column(name = "natural_image_url", columnDefinition = "NVARCHAR(255)", nullable = true)
    private String naturalImageUrl;

    @Column(name = "active", nullable = false)
    private boolean isActive = true;

    public WoodType() {}

    public Integer getWoodTypeId() {
        return woodTypeId;
    }

    public void setWoodTypeId(Integer woodTypeId) {
        this.woodTypeId = woodTypeId;
    }

    public String getWoodTypeName() {
        return woodTypeName;
    }

    public void setWoodTypeName(String woodTypeName) {
        this.woodTypeName = woodTypeName;
    }

    public Material getMaterials() {
        return materials;
    }

    public void setMaterials(Material materials) {
        this.materials = materials;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNaturalImageUrl() {
        return naturalImageUrl;
    }

    public void setNaturalImageUrl(String naturalImageUrl) {
        this.naturalImageUrl = naturalImageUrl;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    // Note: Consider adding index on material_id
    // CREATE INDEX idx_material_id ON WoodTypes(material_id);
}