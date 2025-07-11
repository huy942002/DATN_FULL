package com.example.backend.repository.irepo;

import com.example.backend.entities.ProductCategory;

public interface IProductCategoryService extends IGeneralService<ProductCategory> {
    ProductCategory updateProductCategory(ProductCategory productCategory);
}