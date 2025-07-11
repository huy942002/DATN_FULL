package com.example.backend.repository.irepo;

import com.example.backend.entities.ProductFurnitureType;

public interface IProductFurnitureTypeService extends IGeneralService<ProductFurnitureType> {
    ProductFurnitureType updateProductFurnitureType(ProductFurnitureType productFurnitureType);
}