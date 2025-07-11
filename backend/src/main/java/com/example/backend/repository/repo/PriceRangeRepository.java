package com.example.backend.repository.repo;

import com.example.backend.entities.PriceRange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriceRangeRepository extends JpaRepository<PriceRange, Integer> {
    List<PriceRange> findByIsActiveTrue();
    Optional<PriceRange> findByPriceRangeNameAndIsActiveTrue(String priceRangeName);
}
