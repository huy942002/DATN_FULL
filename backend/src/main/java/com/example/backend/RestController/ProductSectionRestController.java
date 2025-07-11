package com.example.backend.RestController;

import com.example.backend.dto.ProductDTO;
import com.example.backend.repository.imp.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/public/product-sections")
public class ProductSectionRestController {

    @Autowired
    private ProductService productService;

    // Lấy Sản phẩm nổi bật (dựa trên createdAt thay vì ratingCount)
    @GetMapping("/featured")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDTO> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.fromString(direction), sortBy));
        return productService.getFeaturedProducts(pageable);
    }

    // Lấy Gợi ý cho bạn (dựa trên createdAt)
    @GetMapping("/suggestions")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDTO> getSuggestedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.fromString(direction), sortBy));
        return productService.getSuggestedProducts(pageable);
    }

    // Lấy Sản phẩm mới nhất
    @GetMapping("/newest")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDTO> getNewestProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.fromString(direction), sortBy));
        return productService.getNewestProducts(pageable);
    }

    // Lấy Combo giá tốt (dựa trên price thay vì discountedPrice)
    @GetMapping("/deals")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDTO> getDealProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.fromString(direction), sortBy));
        return productService.getDealProducts(pageable);
    }

    // Lấy Khuyến mãi đặc biệt (dựa trên price thay vì discountedPrice)
    @GetMapping("/promotions")
    @ResponseStatus(HttpStatus.OK)
    public Page<ProductDTO> getPromotionalProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.fromString(direction), sortBy));
        return productService.getPromotionalProducts(pageable);
    }
}