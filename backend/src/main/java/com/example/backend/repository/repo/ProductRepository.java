package com.example.backend.repository.repo;

import com.example.backend.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> , JpaSpecificationExecutor<Product> {
    Page<Product> findByIsActiveTrue(Pageable pageable);
    Optional<Product> findByProductIdAndIsActiveTrue(Integer id);
    Page<Product> findByProductNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN p.categories pc " +
            "LEFT JOIN pc.category c " +
            "LEFT JOIN p.furnitureTypes pft " +
            "LEFT JOIN pft.furnitureType ft " +
            "LEFT JOIN p.productDetails pd " +
            "LEFT JOIN pd.color col " +
            "WHERE p.isActive = true " +
            "AND (:search IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:categoryId IS NULL OR c.id = :categoryId) " +
            "AND (:furnitureTypeId IS NULL OR ft.id = :furnitureTypeId) " +
            "AND (:colorId IS NULL OR col.id = :colorId)")
    Page<Product> findByFilters(
            @Param("search") String search,
            @Param("categoryId") Integer categoryId,
            @Param("furnitureTypeId") Integer furnitureTypeId,
            @Param("colorId") Integer colorId,
            Pageable pageable
    );


}