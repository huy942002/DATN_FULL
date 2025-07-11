package com.example.backend.repository.irepo;

import com.example.backend.entities.ProductFunction;

public interface IProductFunctionService extends IGeneralService<ProductFunction> {
    ProductFunction updateProductFunction(ProductFunction productFunction);
}
