package com.example.backend.RestController;

import com.example.backend.dto.ProductDTO;
import com.example.backend.repository.imp.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/search")
public class SearchRestController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDTO> searchProducts(
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) BigDecimal weight,
            @RequestParam(required = false) String dimensions,
            @RequestParam(required = false) Long styleId,
            @RequestParam(required = false) Long woodTypeId,
            @RequestParam(required = false) Long techniqueId,
            @RequestParam(required = false) Long priceRangeId,
            @RequestParam(required = false) String productStatus,
            @RequestParam(required = false) Integer ratingCount,
            @RequestParam(required = false) BigDecimal discountedPrice,
            @RequestParam(required = false) Long furnitureTypeId,
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) Long functionId,
            @RequestParam(required = false) String discountType,
            @RequestParam(required = false) BigDecimal discountValue,
            @RequestParam(required = false) String discountStartDate,
            @RequestParam(required = false) String discountEndDate,
            @RequestParam(required = false) Boolean discountIsActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.fromString(direction), sortBy));
        return productService.searchProducts(
                productName, description, price, weight, dimensions, styleId, woodTypeId, techniqueId,
                priceRangeId, productStatus, ratingCount, discountedPrice, furnitureTypeId, locationId,
                functionId, discountType, discountValue, discountStartDate, discountEndDate, discountIsActive, pageable
        );
    }
}