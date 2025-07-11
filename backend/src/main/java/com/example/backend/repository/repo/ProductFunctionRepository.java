package com.example.backend.repository.repo;

import com.example.backend.entities.ProductFunction;
import com.example.backend.entities.ProductFunction.ProductFunctionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFunctionRepository extends JpaRepository<ProductFunction, Integer> {
    List<ProductFunction> findByProductProductId(Integer productId);
    void deleteByProductProductId(Integer productId);
}