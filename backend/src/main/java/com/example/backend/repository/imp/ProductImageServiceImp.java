package com.example.backend.repository.imp;

import com.example.backend.entities.ProductImage;
import com.example.backend.repository.irepo.IProductImageService;
import com.example.backend.repository.repo.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductImageServiceImp implements IProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;
    @Override
    public Iterable<ProductImage> findAll() {
        return productImageRepository.findAll();
    }

    @Override
    public Optional<ProductImage> findById(Integer id) {
        return productImageRepository.findById(id);
    }

    @Override
    public ProductImage save(ProductImage productImage) {
        return productImageRepository.save(productImage);
    }

    @Override
    public void remove(Integer id) {
        productImageRepository.deleteById(id);
    }
}
