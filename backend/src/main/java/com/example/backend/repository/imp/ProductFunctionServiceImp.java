package com.example.backend.repository.imp;

import com.example.backend.entities.ProductFunction;
import com.example.backend.repository.irepo.IProductFunctionService;
import com.example.backend.repository.repo.ProductFunctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductFunctionServiceImp implements IProductFunctionService {
    @Autowired
    private ProductFunctionRepository productFunctionRepository;

    @Override
    public Iterable<ProductFunction> findAll() {
        return productFunctionRepository.findAll();
    }

    @Override
    public Optional<ProductFunction> findById(Integer id) {
        return productFunctionRepository.findById(id);
    }

    @Override
    public ProductFunction save(ProductFunction productFunction) {
        return productFunctionRepository.save(productFunction);
    }

    @Override
    public void remove(Integer id) {
        productFunctionRepository.deleteById(id);
    }

    @Override
    public ProductFunction updateProductFunction(ProductFunction productFunction) {
        return productFunctionRepository.save(productFunction);
    }
}
