package com.example.backend.repository.repo;

import com.example.backend.entities.ProductFurnitureType;
import com.example.backend.entities.ProductFurnitureType.ProductFurnitureTypeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFurnitureTypeRepository extends JpaRepository<ProductFurnitureType, Integer> {
    List<ProductFurnitureType> findByProductProductId(Integer productId);
    void deleteByProductProductId(Integer productId);
}