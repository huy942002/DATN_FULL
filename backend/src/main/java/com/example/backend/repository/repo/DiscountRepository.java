package com.example.backend.repository.repo;

import com.example.backend.entities.Discount;
import com.example.backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Integer> {

    @Modifying
    @Query("DELETE FROM Discount d WHERE d.product.productId = :productId")
    void deleteByProductProductId(Integer productId);
    Optional<Discount> findByProductProductIdAndIsActiveTrue(Integer productId);
    @Query("SELECT d FROM Discount d WHERE d.isActive = true AND d.startDate <= CURRENT_TIMESTAMP AND (d.endDate IS NULL OR d.endDate >= CURRENT_TIMESTAMP)")
    List<Discount> findActiveDiscounts();


}
