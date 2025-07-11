package com.example.backend.repository.repo;

import com.example.backend.entities.Product;
import com.example.backend.entities.ProductDetails;
import com.example.backend.entities.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement,Integer> {
}
