package com.example.backend.repository.imp;

import com.example.backend.entities.ProductFurnitureType;
import com.example.backend.repository.irepo.IProductFurnitureTypeService;
import com.example.backend.repository.repo.ProductFurnitureTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductFurnitureTypeServiceImp implements IProductFurnitureTypeService {
    @Autowired
    private ProductFurnitureTypeRepository productFurnitureTypeRepository;

    @Override
    public Iterable<ProductFurnitureType> findAll() {
        return productFurnitureTypeRepository.findAll();
    }

    @Override
    public Optional<ProductFurnitureType> findById(Integer id) {
        return productFurnitureTypeRepository.findById(id);
    }

    @Override
    public ProductFurnitureType save(ProductFurnitureType productFurnitureType) {
        return productFurnitureTypeRepository.save(productFurnitureType);
    }

    @Override
    public void remove(Integer id) {
        productFurnitureTypeRepository.deleteById(id);
    }

    @Override
    public ProductFurnitureType updateProductFurnitureType(ProductFurnitureType productFurnitureType) {
        return productFurnitureTypeRepository.save(productFurnitureType);
    }
}