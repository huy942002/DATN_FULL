package com.example.backend.repository.irepo;

import com.example.backend.dto.ProductDTO;
import com.example.backend.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IProductService extends IGeneralService<Product> {
    Page<ProductDTO> findAllProductDTO(Pageable pageable, String search, Boolean isActive);
    ProductDTO findByIdProductDTO(Integer id);
    ProductDTO create(ProductDTO productDTO);
    ProductDTO update(Integer id, ProductDTO productDTO);
    void delete(Integer id);
}