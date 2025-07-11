package com.example.backend.repository.imp;

import com.example.backend.entities.ProductView;
import com.example.backend.repository.irepo.IProductViewService;
import com.example.backend.repository.repo.ProductViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductViewServiceImp implements IProductViewService {
    @Autowired
    private ProductViewRepository productViewRepository;

    @Override
    @SuppressWarnings("unchecked")
    public Iterable<ProductView> findAll() {
        return productViewRepository.findAll();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Optional<ProductView> findById(Integer id) {
        return productViewRepository.findById(id.longValue()).map(productView -> (ProductView) productView);
    }

    @Override
    public ProductView save(ProductView productView) {
        return productViewRepository.save(productView);
    }

    @Override
    public void remove(Integer id) {
        productViewRepository.deleteById(id.longValue());
    }
}
