package com.example.backend.repository.irepo;

import com.example.backend.entities.ProductColor;
import org.springframework.stereotype.Service;

@Service
public interface IProductColorService extends IGeneralService<ProductColor> {
    public ProductColor updateProductColor(ProductColor productColor);
}
