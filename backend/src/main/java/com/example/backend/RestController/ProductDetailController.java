package com.example.backend.RestController;

import com.example.backend.dto.ProductDetailsDTO;
import com.example.backend.entities.ProductDetails;
import com.example.backend.repository.imp.ProductDetailServiceImp;
import com.example.backend.repository.repo.ProductColorRepository;
import com.example.backend.repository.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-details")
public class ProductDetailController {
    @Autowired
    private ProductColorRepository productColorRepository;
    @Autowired
    private ProductDetailServiceImp service;

    @GetMapping
    public ResponseEntity<Page<ProductDetailsDTO>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "all") String isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDetails> pageResult = service.findAllPageable(search, isActive, pageable);
        Page<ProductDetailsDTO> dtoPage = pageResult.map(service::convertToDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsDTO> getById(@PathVariable Integer id) {
        Optional<ProductDetails> productDetail = service.findById(id);
        return productDetail.map(entity -> ResponseEntity.ok(service.convertToDTO(entity)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-product/{productId}")
    public ResponseEntity<List<ProductDetailsDTO>> getByProductId(@PathVariable Integer productId) {
        List<ProductDetailsDTO> details = service.findAllByProductId(productId);
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<ProductDetailsDTO> create(@RequestBody ProductDetailsDTO dto) {
        ProductDetails entity = convertToEntity(dto);
        ProductDetails savedEntity = service.save(entity);
        return ResponseEntity.ok(service.convertToDTO(savedEntity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailsDTO> update(@PathVariable Integer id, @RequestBody ProductDetailsDTO dto) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        ProductDetails entity = convertToEntity(dto);
        entity.setProductDetailsId(id);
        ProductDetails updatedEntity = service.save(entity);
        return ResponseEntity.ok(service.convertToDTO(updatedEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.remove(id);
        return ResponseEntity.noContent().build();
    }

    public ProductDetailsDTO convertToDTO(ProductDetails entity) {
        if (entity == null) {
            return null;
        }
        ProductDetailsDTO dto = new ProductDetailsDTO();
        dto.setProductDetailsId(entity.getProductDetailsId());
        dto.setColorId(entity.getColor() != null ? entity.getColor().getColorId() : null);
        dto.setPrice(entity.getPrice());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setActive(entity.isActive());
        dto.setImageUrl(entity.getImageUrl());
        dto.setSku(entity.getSku());
        dto.setBarcode(entity.getBarcode());
        dto.setMetaTagTitle(entity.getMetaTagTitle());
        dto.setMetaTagDescription(entity.getMetaTagDescription());
        dto.setMetaKeywords(entity.getMetaKeywords());
        return dto;
    }

    /**
     * Chuyển đổi từ DTO sang entity.
     */
    private ProductDetails convertToEntity(ProductDetailsDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("DTO cannot be null");
        }
        ProductDetails entity = new ProductDetails();
        entity.setProductDetailsId(dto.getProductDetailsId());
        if (dto.getColorId() != null) {
            entity.setColor(productColorRepository.findById(dto.getColorId())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found")));
        }
        entity.setPrice(dto.getPrice());
        entity.setStockQuantity(dto.getStockQuantity());
        entity.setActive(dto.isActive() == null || Boolean.TRUE.equals(dto.isActive()));
        entity.setImageUrl(dto.getImageUrl());
        entity.setSku(dto.getSku());
        entity.setBarcode(dto.getBarcode());
        entity.setMetaTagTitle(dto.getMetaTagTitle());
        entity.setMetaTagDescription(dto.getMetaTagDescription());
        entity.setMetaKeywords(dto.getMetaKeywords());
        return entity;
    }
}