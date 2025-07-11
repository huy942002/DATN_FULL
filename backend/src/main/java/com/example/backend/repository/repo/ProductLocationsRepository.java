package com.example.backend.repository.repo;

import com.example.backend.entities.ProductLocations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductLocationsRepository extends JpaRepository<ProductLocations,Integer> {
    @Modifying
    @Query("DELETE FROM ProductLocations pl WHERE pl.product.productId = :productId")
    void deleteByProductProductId(Integer productId);
    @Query("SELECT pl FROM ProductLocations pl WHERE pl.product.productId = :productId")
    List<ProductLocations> findByProductProductId(Integer productId);
}
