package com.example.backend.repository.repo;

import com.example.backend.entities.ProductCategory;
import com.example.backend.entities.ProductCategory.ProductCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {
    List<ProductCategory> findByProductProductId(Integer productId);
    void deleteByProductProductId(Integer productId);
}