package com.example.backend.repository.repo;

import com.example.backend.entities.Product;
import com.example.backend.entities.ProductReview;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProductAndIsActiveTrue(Product product);
    List<ProductReview> findByUserAndIsActiveTrue(User user);
    List<ProductReview> findByIsActiveTrue();
    @Query("SELECT AVG(pr.rating) FROM ProductReview pr WHERE pr.product = :product AND pr.isActive = true")
    Double findAverageRatingByProduct(Product product);
}
