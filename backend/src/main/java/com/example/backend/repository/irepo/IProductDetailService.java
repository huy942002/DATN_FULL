package com.example.backend.repository.irepo;

import com.example.backend.dto.ProductDetailsDTO;
import com.example.backend.entities.ProductDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IProductDetailService extends IGeneralService<ProductDetails> {
    Page<ProductDetails> findAllPageable(String search, String isActive, Pageable pageable);
    List<ProductDetailsDTO> findAllByProductId(Integer productId);
}