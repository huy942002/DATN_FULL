//package com.example.backend.RestController;
//import com.example.backend.dto.ProductDTO;
//import com.example.backend.exception.ResourceNotFoundException;
//import com.example.backend.repository.imp.ProductService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.math.BigDecimal;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/products")
//public class ProductHomeRestController {
//    @Autowired
//    private ProductService productService;
//
//    /**
//     * Get new products, sorted by creation date (newest first), size = 5
//     */
//    @GetMapping("/new")
//    public ResponseEntity<Page<ProductDTO>> getNewProducts(
//            @RequestParam(defaultValue = "0") int page) {
//        Pageable pageable = PageRequest.of(page, 5, Sort.by("createdAt").descending());
//        Page<ProductDTO> products = productService.getAllProducts(pageable, null);
//        return ResponseEntity.ok(products);
//    }
//
//    /**
//     * Get best price products with size = 5, sorted by final price
//     */
//    @GetMapping("/best-price")
//    public ResponseEntity<Page<ProductDTO>> getBestPriceProducts(
//            @RequestParam(defaultValue = "0") int page) {
//        Pageable pageable = PageRequest.of(page, 5);
//        Page<ProductDTO> products = productService.getAllProducts(pageable, null)
//                .map(dto -> {
//                    if (dto.getDiscount() != null && dto.getDiscount().isActive()) {
//                        BigDecimal finalPrice = productService.calculateFinalPriceForDTO(dto);
//                        dto.setPrice(finalPrice);
//                    }
//                    return dto;
//                })
//                .sorted((p1, p2) -> p1.getPrice().compareTo(p2.getPrice()));
//        return ResponseEntity.ok(products);
//    }
//
//    /**
//     * Get all product lists grouped by categories, size = 5 per category
//     */
//    @GetMapping("/lists")
//    public ResponseEntity<Map<String, Page<ProductDTO>>> getAllProductLists(
//            @RequestParam(defaultValue = "0") int page) {
//        Map<String, Page<ProductDTO>> productLists = new HashMap<>();
//
//        // New products
//        Pageable pageable = PageRequest.of(page, 5, Sort.by("createdAt").descending());
//        productLists.put("newProducts", productService.getAllProducts(pageable, null));
//
//        // Best price products
//        Page<ProductDTO> bestPriceProducts = productService.getAllProducts(pageable, null)
//                .map(dto -> {
//                    if (dto.getDiscount() != null && dto.getDiscount().isActive()) {
//                        BigDecimal finalPrice = productService.calculateFinalPriceForDTO(dto);
//                        dto.setPrice(finalPrice);
//                    }
//                    return dto;
//                })
//                .sorted((p1, p2) -> p1.getPrice().compareTo(p2.getPrice()));
//        productLists.put("bestPriceProducts", bestPriceProducts);
//
//        // Group products by category dynamically
//        Page<ProductDTO> allProducts = productService.getAllProducts(pageable, null);
//        allProducts.forEach(dto -> {
//            if (dto.getCategories() != null) {
//                dto.getCategories().forEach(category -> {
//                    String categoryKey = "category_" + category.getCategoryId();
//                    Page<ProductDTO> categoryProducts = productLists.computeIfAbsent(categoryKey, k ->
//                            Page.empty()
//                    ).map(p -> p);
//                    if (!categoryProducts.contains(dto)) {
//                        productLists.put(categoryKey, PageRequest.of(page, 5).getPageable().map(p -> dto));
//                    }
//                });
//            }
//        });
//
//        return ResponseEntity.ok(productLists);
//    }
//
//    /**
//     * Global exception handler for ResourceNotFoundException
//     */
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
//        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
//    }
//}
