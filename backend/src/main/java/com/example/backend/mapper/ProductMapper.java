package com.example.backend.mapper;

import com.example.backend.dto.*;
import com.example.backend.entities.*;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "styleId", source = "style.styleId")
    @Mapping(target = "woodTypeId", source = "woodType.woodTypeId")
    @Mapping(target = "techniqueId", source = "technique.techniqueId")
    @Mapping(target = "priceRangeId", source = "priceRange.priceRangeId")
    @Mapping(target = "supplierId", source = "supplier.supplierId")
    @Mapping(target = "ratingCount", ignore = true)
    @Mapping(target = "discountedPrice", ignore = true)
    ProductDTO toProductDTO(Product product);

    @AfterMapping
    default void afterMapping(Product product, @MappingTarget ProductDTO dto) {
        if (product != null) {
            dto.setProductDetails(mapProductDetails(product.getProductDetails()));
            dto.setImages(mapProductImages(product.getImages()));
            dto.setProductLocations(mapProductLocations(product.getProductLocations()));
            dto.setCategories(mapProductCategories(product.getCategories()));
            dto.setFurnitureTypes(mapProductFurnitureTypes(product.getFurnitureTypes()));
            dto.setFunctions(mapProductFunctions(product.getFunctions()));
            dto.setDiscount(product.getDiscount() != null ? toDiscountDTO(product.getDiscount()) : null);
        }
    }

    @Mapping(target = "style", ignore = true)
    @Mapping(target = "woodType", ignore = true)
    @Mapping(target = "technique", ignore = true)
    @Mapping(target = "priceRange", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "productDetails", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "furnitureTypes", ignore = true)
    @Mapping(target = "functions", ignore = true)
    @Mapping(target = "productLocations", ignore = true)
    @Mapping(target = "discount", ignore = true)
    Product toProductEntity(ProductDTO productDTO);

    @Mapping(target = "colorId", source = "color.colorId")
    @Mapping(target = "productDetailsId", source = "productDetailsId")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    ProductDetailsDTO toProductDetailsDTO(ProductDetails productDetails);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "color", ignore = true)
    ProductDetails toProductDetailsEntity(ProductDetailsDTO productDetailsDTO);

    ProductImageDTO toProductImageDTO(ProductImage productImage);

    @Mapping(target = "product", ignore = true)
    ProductImage toProductImageEntity(ProductImageDTO productImageDTO);

    DiscountDTO toDiscountDTO(Discount discount);

    @Mapping(target = "product", ignore = true)
    Discount toDiscountEntity(DiscountDTO discountDTO);

    @Mapping(target = "categoryId", source = "category.categoryId")
    ProductCategoryDTO toProductCategoryDTO(ProductCategory productCategory);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "category", ignore = true)
    ProductCategory toProductCategoryEntity(ProductCategoryDTO productCategoryDTO);

    @Mapping(target = "furnitureTypeId", source = "furnitureType.furnitureTypeId")
    ProductFurnitureTypeDTO toProductFurnitureTypeDTO(ProductFurnitureType productFurnitureType);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "furnitureType", ignore = true)
    ProductFurnitureType toProductFurnitureTypeEntity(ProductFurnitureTypeDTO productFurnitureTypeDTO);

    @Mapping(target = "functionId", source = "function.functionId")
    ProductFunctionDTO toProductFunctionDTO(ProductFunction productFunction);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "function", ignore = true)
    ProductFunction toProductFunctionEntity(ProductFunctionDTO productFunctionDTO);

    @Mapping(target = "locationId", source = "location.locationId")
    ProductLocationsDTO toProductLocationsDTO(ProductLocations productLocations);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "location", ignore = true)
    ProductLocations toProductLocationsEntity(ProductLocationsDTO productLocationsDTO);

    SupplierDTO toSupplierDTO(Supplier supplier);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Supplier toSupplierEntity(SupplierDTO supplierDTO);

    default List<ProductDetailsDTO> mapProductDetails(List<ProductDetails> productDetails) {
        return productDetails != null ? productDetails.stream().map(this::toProductDetailsDTO).collect(Collectors.toList()) : null;
    }

    default List<ProductImageDTO> mapProductImages(List<ProductImage> productImages) {
        return productImages != null ? productImages.stream().map(this::toProductImageDTO).collect(Collectors.toList()) : null;
    }

    default List<ProductCategoryDTO> mapProductCategories(List<ProductCategory> productCategories) {
        return productCategories != null ? productCategories.stream().map(this::toProductCategoryDTO).collect(Collectors.toList()) : null;
    }

    default List<ProductFurnitureTypeDTO> mapProductFurnitureTypes(List<ProductFurnitureType> productFurnitureTypes) {
        return productFurnitureTypes != null ? productFurnitureTypes.stream().map(this::toProductFurnitureTypeDTO).collect(Collectors.toList()) : null;
    }

    default List<ProductFunctionDTO> mapProductFunctions(List<ProductFunction> productFunctions) {
        return productFunctions != null ? productFunctions.stream().map(this::toProductFunctionDTO).collect(Collectors.toList()) : null;
    }

    default List<ProductLocationsDTO> mapProductLocations(List<ProductLocations> productLocations) {
        return productLocations != null ? productLocations.stream().map(this::toProductLocationsDTO).collect(Collectors.toList()) : null;
    }
}