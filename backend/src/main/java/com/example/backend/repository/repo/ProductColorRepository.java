package com.example.backend.repository.repo;

import com.example.backend.entities.ProductColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductColorRepository extends JpaRepository<ProductColor,Integer> {
    List<ProductColor> findByIsActiveTrue();
    Optional<ProductColor> findByColorNameAndIsActiveTrue(String colorName);
}
