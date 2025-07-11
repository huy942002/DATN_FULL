package com.example.backend.repository.imp;

import com.example.backend.dto.ProductDetailsDTO;
import com.example.backend.entities.ProductDetails;
import com.example.backend.repository.irepo.IProductDetailService;
import com.example.backend.repository.repo.ProductDetailsRepository;
import com.example.backend.repository.repo.ProductColorRepository;
import com.example.backend.repository.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Triển khai dịch vụ cho ProductDetails.
 */
@Service
public class ProductDetailServiceImp implements IProductDetailService {

    @Autowired
    private ProductDetailsRepository repository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductColorRepository productColorRepository;

    @Override
    public List<ProductDetails> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<ProductDetails> findById(Integer id) {
        if (id == null) {
            return Optional.empty();
        }
        return repository.findById(id);
    }

    @Override
    public ProductDetails save(ProductDetails productDetails) {
        if (productDetails == null) {
            throw new IllegalArgumentException("ProductDetails cannot be null");
        }
        if (productDetails.getSku() == null || productDetails.getSku().isEmpty()) {
            String sku = generateUniqueSku(productDetails);
            String barcode = generateUniqueBarcode(productDetails);
            productDetails.setSku(sku);
            productDetails.setBarcode(barcode);
        }
        return repository.save(productDetails);
    }

    @Override
    public void remove(Integer id) {
        if (id == null || !repository.existsById(id)) {
            throw new IllegalArgumentException("ProductDetails not found");
        }
        repository.deleteById(id);
    }

    @Override
    public Page<ProductDetails> findAllPageable(String search, String isActive, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            if ("active".equals(isActive)) {
                return repository.findBySkuContainingAndActive(search, true, pageable);
            } else if ("inactive".equals(isActive)) {
                return repository.findBySkuContainingAndActive(search, false, pageable);
            } else {
                return repository.findBySkuContaining(search, pageable);
            }
        } else {
            if ("active".equals(isActive)) {
                return repository.findByActive(true, pageable);
            } else if ("inactive".equals(isActive)) {
                return repository.findByActive(false, pageable);
            } else {
                return repository.findAll(pageable);
            }
        }
    }

    @Override
    public List<ProductDetailsDTO> findAllByProductId(Integer productId) {
        if (productId == null || !productRepository.existsById(productId)) {
            return List.of(); // Trả về danh sách rỗng thay vì ném ngoại lệ
        }
        List<ProductDetails> details = repository.findAllByProductId(productId);
        return details.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Chuẩn hóa chuỗi tiếng Việt thành chữ cái Latin không dấu.
     */
    private String normalizeString(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
    }

    /**
     * Tạo mã SKU duy nhất dựa trên Product và ProductColor.
     */
    private String generateUniqueSku(ProductDetails productDetails) {
        if (productDetails == null || productDetails.getProduct() == null) {
            throw new IllegalArgumentException("ProductDetails or Product cannot be null");
        }

        String productPrefix = "PRO";
        String categoryPrefix = "CAT";
        String woodTypePrefix = "WOD";
        String colorPrefix = "COL";

        // Lấy prefix từ Product
        String productName = productDetails.getProduct().getProductName();
        if (productName != null && !productName.isEmpty()) {
            productPrefix = normalizeString(productName).substring(0, Math.min(3, productName.length()));
        } else {
            productPrefix = "P" + productDetails.getProduct().getProductId();
        }

        // Lấy prefix từ WoodType
        if (productDetails.getProduct().getWoodType() != null) {
            String woodTypeName = productDetails.getProduct().getWoodType().getWoodTypeName();
            if (woodTypeName != null && !woodTypeName.isEmpty()) {
                woodTypePrefix = normalizeString(woodTypeName).substring(0, Math.min(3, woodTypeName.length()));
            }
        }

        // Lấy prefix từ ProductColor
        if (productDetails.getColor() != null) {
            String hexCode = productDetails.getColor().getColorHexCode();
            if (hexCode != null && hexCode.startsWith("#")) {
                colorPrefix = hexCode.replace("#", "").toUpperCase();
            } else {
                String colorName = productDetails.getColor().getColorName();
                if (colorName != null && !colorName.isEmpty()) {
                    colorPrefix = normalizeString(colorName).substring(0, Math.min(3, colorName.length()));
                }
            }
        }

        Random random = new Random();
        String sku;
        boolean isUnique;
        int attempts = 0;

        do {
            if (attempts++ > 10) {
                throw new RuntimeException("Unable to generate unique SKU after multiple attempts");
            }
            int randomNumber = 1000 + random.nextInt(9000);
            sku = String.format("%s-%s-%s-%s-%d", productPrefix, categoryPrefix, woodTypePrefix, colorPrefix, randomNumber);
            isUnique = repository.findBySku(sku).isEmpty();
        } while (!isUnique);

        return sku;
    }

    /**
     * Tạo mã Barcode duy nhất.
     */
    private String generateUniqueBarcode(ProductDetails productDetails) {
        if (productDetails == null || productDetails.getProduct() == null) {
            throw new IllegalArgumentException("ProductDetails or Product cannot be null");
        }

        String barcodePrefix = "BCD";
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String productIdPart = String.format("%05d", productDetails.getProduct().getProductId());
        String colorIdPart = productDetails.getColor() != null ?
                String.format("%05d", productDetails.getColor().getColorId()) : "00000";

        Random random = new Random();
        String barcode;
        boolean isUnique;
        int attempts = 0;

        do {
            if (attempts++ > 10) {
                throw new RuntimeException("Unable to generate unique Barcode after multiple attempts");
            }
            int randomNumber = 1000 + random.nextInt(9000);
            barcode = String.format("%s-%s-%s-%s-%d", barcodePrefix, datePart, productIdPart, colorIdPart, randomNumber);
            isUnique = repository.findByBarcode(barcode).isEmpty();
        } while (!isUnique);

        return barcode;
    }

    /**
     * Chuyển đổi từ entity sang DTO.
     */
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