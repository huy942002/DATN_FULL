package com.example.backend.repository.imp;

import com.example.backend.entities.ProductColor;
import com.example.backend.repository.irepo.IProductColorService;
import com.example.backend.repository.repo.ProductColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ProductColorServiceImp implements IProductColorService {
    @Autowired
    private ProductColorRepository productColorRepository;
    @Override
    public Iterable<ProductColor> findAll() {
        return productColorRepository.findAll();
    }

    @Override
    public Optional<ProductColor> findById(Integer id) {
        return productColorRepository.findById(id);
    }

    @Override
    public ProductColor save(ProductColor productColor) {
        return productColorRepository.save(productColor);
    }

    @Override
    public void remove(Integer id) {
        productColorRepository.deleteById(id);
    }

    @Override
    public ProductColor updateProductColor(ProductColor productColor) {
        return productColorRepository.save(productColor);
    }
}
