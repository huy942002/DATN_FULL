package com.example.backend.repository.imp;

import com.example.backend.entities.ProductReview;
import com.example.backend.repository.irepo.IProductReviewService;
import com.example.backend.repository.repo.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductReviewServiceImp implements IProductReviewService {
    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Override
    @SuppressWarnings("unchecked")
    public Iterable<ProductReview> findAll() {
        return productReviewRepository.findAll();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Optional<ProductReview> findById(Integer id) {
        return productReviewRepository.findById(id.longValue()).map(productReview -> (ProductReview) productReview);
    }

    @Override
    public ProductReview save(ProductReview productReview) {
        return productReviewRepository.save(productReview);
    }

    @Override
    public void remove(Integer id) {
        productReviewRepository.deleteById(id.longValue());
    }
}
