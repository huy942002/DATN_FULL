package com.example.backend.repository.imp;

import com.example.backend.entities.ProductCategory;
import com.example.backend.repository.irepo.IProductCategoryService;
import com.example.backend.repository.repo.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductCategoryServiceImp implements IProductCategoryService {
    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Override
    public Iterable<ProductCategory> findAll() {
        return productCategoryRepository.findAll();
    }

    @Override
    public Optional<ProductCategory> findById(Integer id) {
        return productCategoryRepository.findById(id);
    }

    @Override
    public ProductCategory save(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @Override
    public void remove(Integer id) {
        productCategoryRepository.deleteById(id);
    }

    @Override
    public ProductCategory updateProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }
}