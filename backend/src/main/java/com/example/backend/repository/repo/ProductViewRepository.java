package com.example.backend.repository.repo;

import com.example.backend.entities.Product;
import com.example.backend.entities.ProductView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductViewRepository extends JpaRepository<ProductView, Long> {
    List<ProductView> findByProductAndIsActiveTrue(Product product);
    List<ProductView> findByIsActiveTrue();
    @Query("SELECT COUNT(pv) FROM ProductView pv WHERE pv.product = :product AND pv.isActive = true")
    Long countByProductAndIsActiveTrue(Product product);
}
