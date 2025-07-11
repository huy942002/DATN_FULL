package com.example.backend.RestController;

import com.example.backend.entities.Product;
import com.example.backend.entities.ProductImage;
import com.example.backend.repository.repo.ProductImageRepository;
import com.example.backend.repository.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/product-images/")
public class ProductImageController {

    @Autowired
    private ProductImageRepository productImageService;

    @Autowired
    private ProductRepository productService;

    @GetMapping("product/{productId}")
    public ResponseEntity<List<ProductImage>> getImages(@PathVariable Integer productId) {
        Product product = productService.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        List<ProductImage> Images = productImageService.findByProduct(product);
        for (ProductImage productImage :Images
             ) {
            System.out.println(productImage);
        }
        return ResponseEntity.ok(Images);
    }
}
