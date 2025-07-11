package com.example.backend.repository.repo;

import com.example.backend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer> {
    List<Category> findByIsActiveTrue();
    Optional<Category> findByCategoryNameAndIsActiveTrue(String categoryName);
}
