package com.example.backend.repository.imp;

import com.example.backend.dto.*;
import com.example.backend.entities.*;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.repo.*;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductDetailsRepository productDetailsRepository;
    @Autowired
    private ProductImageRepository productImageRepository;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    @Autowired
    private ProductFurnitureTypeRepository productFurnitureTypeRepository;
    @Autowired
    private ProductFunctionRepository productFunctionRepository;
    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private StyleRepository styleRepository;
    @Autowired
    private WoodTypeRepository woodTypeRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private CraftingTechniqueRepository techniqueRepository;
    @Autowired
    private PriceRangeRepository priceRangeRepository;
    @Autowired
    private ProductColorRepository productColorRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private FurnitureTypeRepository furnitureTypeRepository;
    @Autowired
    private FunctionRepository functionRepository;
    @Autowired
    private ProductLocationsRepository productLocationsRepository;
    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private SupplierRepository supplierRepository;

    public Page<ProductDTO> getProductsForPOS(
            Pageable pageable,
            String search,
            Integer categoryId,
            Integer furnitureTypeId,
            Integer colorId,
            String sortBy,
            String sortDirection
    ) {
        // Validate sortBy parameter
        String validSortBy = sortBy != null && List.of("productName", "price", "discountedPrice", "stockQuantity", "createdAt", "updatedAt", "ratingCount").contains(sortBy)
                ? sortBy
                : "productName";
        Sort.Direction direction = sortDirection != null && sortDirection.equalsIgnoreCase("DESC")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        // Map sortBy to appropriate entity field (use Product fields where possible)
        String sortField;
        switch (validSortBy) {
            case "price":
            case "discountedPrice":
                sortField = "price"; // Use Product.price
                break;
            case "stockQuantity":
            case "ratingCount":
                sortField = "productId"; // Fallback to productId for collection-based fields
                break;
            default:
                sortField = validSortBy;
        }

        // Create a new pageable with validated sorting
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(direction, sortField)
        );

        // Fetch products with filters
        Page<Product> productPage = productRepository.findByFilters(
                search,
                categoryId,
                furnitureTypeId,
                colorId,
                sortedPageable
        );

        // Map to DTOs
        return productPage.map(product -> {
            ProductDTO dto = productMapper.toProductDTO(product);
            dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
            dto.setImages(productMapper.mapProductImages(product.getImages()));
            dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
            dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
            dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
            dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
            Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
            dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
            dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
            dto.setDiscountedPrice(calculateFinalPrice(product, discount));
            return dto;
        });
    }

    public Page<ProductDTO> searchProducts(
            String productName, String description, BigDecimal price, BigDecimal weight, String dimensions,
            Long styleId, Long woodTypeId, Long techniqueId, Long priceRangeId, String productStatus,
            Integer ratingCount, BigDecimal discountedPrice, Long furnitureTypeId, Long locationId,
            Long functionId, String discountType, BigDecimal discountValue, String discountStartDate,
            String discountEndDate, Boolean discountIsActive, Pageable pageable
    ) {
        Specification<Product> spec = new Specification<Product>() {
            @Override
            public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();

                // Direct product attributes
                if (productName != null && !productName.isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("productName")), "%" + productName.toLowerCase() + "%"));
                }
                if (description != null && !description.isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%"));
                }
                if (price != null) {
                    predicates.add(cb.equal(root.get("price"), price));
                }
                if (weight != null) {
                    predicates.add(cb.equal(root.get("weight"), weight));
                }
                if (dimensions != null && !dimensions.isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("dimensions")), "%" + dimensions.toLowerCase() + "%"));
                }
                if (styleId != null) {
                    predicates.add(cb.equal(root.get("style").get("styleId"), styleId)); // Join to Style
                }
                if (woodTypeId != null) {
                    predicates.add(cb.equal(root.get("woodType").get("woodTypeId"), woodTypeId)); // Join to WoodType
                }
                if (techniqueId != null) {
                    predicates.add(cb.equal(root.get("technique").get("techniqueId"), techniqueId)); // Join to CraftingTechnique
                }
                if (priceRangeId != null) {
                    Join<Product, PriceRange> priceRangeJoin = root.join("priceRange", JoinType.LEFT);
                    predicates.add(cb.equal(priceRangeJoin.get("priceRangeId"), priceRangeId));
                }
                if (productStatus != null && !productStatus.isEmpty()) {
                    predicates.add(cb.equal(root.get("productStatus"), productStatus));
                }
                if (ratingCount != null) {
                    predicates.add(cb.greaterThanOrEqualTo(
                            cb.size(root.join("productDetails", JoinType.LEFT)),
                            cb.literal(ratingCount)
                    ));
                }
                if (discountedPrice != null) {
                    predicates.add(cb.equal(root.get("discountedPrice"), discountedPrice));
                }

                // Nested relationships with LEFT JOIN
                if (furnitureTypeId != null) {
                    Join<Product, ProductFurnitureType> joinFurnitureTypes = root.join("furnitureTypes", JoinType.LEFT);
                    predicates.add(cb.equal(joinFurnitureTypes.get("furnitureTypeId"), furnitureTypeId));
                }
                if (locationId != null) {
                    Join<Product, ProductLocations> joinLocations = root.join("productLocations", JoinType.LEFT);
                    predicates.add(cb.equal(joinLocations.get("locationId"), locationId));
                }
                if (functionId != null) {
                    Join<Product, ProductFunction> joinFunctions = root.join("functions", JoinType.LEFT);
                    predicates.add(cb.equal(joinFunctions.get("functionId"), functionId));
                }
                if (discountType != null && !discountType.isEmpty()) {
                    Join<Product, Discount> joinDiscount = root.join("discount", JoinType.LEFT);
                    predicates.add(cb.equal(joinDiscount.get("discountType"), Discount.DiscountType.valueOf(discountType)));
                }
                if (discountValue != null) {
                    Join<Product, Discount> joinDiscount = root.join("discount", JoinType.LEFT);
                    predicates.add(cb.equal(joinDiscount.get("discountValue"), discountValue));
                }
                if (discountStartDate != null && !discountStartDate.isEmpty()) {
                    Join<Product, Discount> joinDiscount = root.join("discount", JoinType.LEFT);
                    predicates.add(cb.greaterThanOrEqualTo(joinDiscount.get("startDate"), LocalDateTime.parse(discountStartDate)));
                }
                if (discountEndDate != null && !discountEndDate.isEmpty()) {
                    Join<Product, Discount> joinDiscount = root.join("discount", JoinType.LEFT);
                    predicates.add(cb.lessThanOrEqualTo(joinDiscount.get("endDate"), LocalDateTime.parse(discountEndDate)));
                }
                if (discountIsActive != null) {
                    Join<Product, Discount> joinDiscount = root.join("discount", JoinType.LEFT);
                    predicates.add(cb.equal(joinDiscount.get("isActive"), discountIsActive));
                }

                predicates.add(cb.equal(root.get("isActive"), true)); // Only active products
                return cb.and(predicates.toArray(new Predicate[0]));
            }
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<ProductDTO> dtoList = productPage.getContent().stream()
                .map(product -> {
                    ProductDTO dto = productMapper.toProductDTO(product);
                    dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
                    dto.setImages(productMapper.mapProductImages(product.getImages()));
                    dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
                    dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
                    dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
                    dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
                    Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
                    dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
                    dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
                    dto.setDiscountedPrice(calculateFinalPrice(product, discount));
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, productPage.getTotalElements());
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = productMapper.toProductEntity(productDTO);
        setRelatedEntities(product, productDTO);
        product = productRepository.save(product);
        saveRelatedEntities(product, productDTO);

        ProductDTO result = productMapper.toProductDTO(product);
        result.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
        result.setImages(productMapper.mapProductImages(product.getImages()));
        result.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
        result.setCategories(productMapper.mapProductCategories(product.getCategories()));
        result.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
        result.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
        Discount discount = product.getDiscount() != null && product.getDiscount().isActive() ? product.getDiscount() : null;
        result.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
        result.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
        result.setDiscountedPrice(calculateFinalPrice(product, discount));
        return result;
    }

    public Page<ProductDTO> getAllProducts(Pageable pageable, String search) {
        Page<Product> products = search != null
                ? productRepository.findByProductNameContainingIgnoreCaseAndIsActiveTrue(search, pageable)
                : productRepository.findByIsActiveTrue(pageable);
        return products.map(product -> {
            ProductDTO dto = productMapper.toProductDTO(product);
            dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
            dto.setImages(productMapper.mapProductImages(product.getImages()));
            dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
            dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
            dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
            dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
            Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
            dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
            dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
            dto.setDiscountedPrice(calculateFinalPrice(product, discount));
            return dto;
        });
    }

    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findByProductIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        ProductDTO dto = productMapper.toProductDTO(product);
        dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
        dto.setImages(productMapper.mapProductImages(product.getImages()));
        dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
        dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
        dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
        dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
        Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
        dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
        dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
        dto.setDiscountedPrice(calculateFinalPrice(product, discount));
        return dto;
    }

    @Transactional
    public ProductDTO updateProduct(Integer id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setProductName(productDTO.getProductName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setWeight(productDTO.getWeight());
        product.setDimensions(productDTO.getDimensions());
        product.setImageUrl(productDTO.getImageUrl());
        product.setProductStatus(productDTO.getProductStatus());
        product.setActive(productDTO.isActive());
        setRelatedEntities(product, productDTO);
        updateRelatedEntities(product, productDTO);
        product = productRepository.save(product);
        ProductDTO result = productMapper.toProductDTO(product);
        result.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
        result.setCategories(productMapper.mapProductCategories(product.getCategories()));
        result.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
        result.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
        Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
        result.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
        result.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
        result.setDiscountedPrice(calculateFinalPrice(product, discount));
        return result;
    }

    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    private void setRelatedEntities(Product product, ProductDTO productDTO) {
        if (productDTO.getStyleId() != null) {
            Style style = styleRepository.findById(productDTO.getStyleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Style not found"));
            product.setStyle(style);
        }
        if (productDTO.getWoodTypeId() != null) {
            WoodType woodType = woodTypeRepository.findById(productDTO.getWoodTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("WoodType not found"));
            product.setWoodType(woodType);
        }
        if (productDTO.getTechniqueId() != null) {
            CraftingTechnique technique = techniqueRepository.findById(productDTO.getTechniqueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Technique not found"));
            product.setTechnique(technique);
        }
        if (productDTO.getPriceRangeId() != null) {
            PriceRange priceRange = priceRangeRepository.findById(productDTO.getPriceRangeId())
                    .orElseThrow(() -> new ResourceNotFoundException("PriceRange not found"));
            product.setPriceRange(priceRange);
        }
        if (productDTO.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(productDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
            product.setSupplier(supplier);
        }
    }

    private void saveRelatedEntities(Product product, ProductDTO productDTO) {
        if (productDTO.getProductDetails() != null) {
            productDetailsRepository.deleteByProductProductId(product.getProductId());
            for (ProductDetailsDTO detailsDTO : productDTO.getProductDetails()) {
                ProductDetails details = productMapper.toProductDetailsEntity(detailsDTO);
                details.setProduct(product);
                if (detailsDTO.getColorId() == null) {
                    throw new IllegalArgumentException("Color ID is required for product details");
                }
                ProductColor color = productColorRepository.findById(detailsDTO.getColorId())
                        .orElseThrow(() -> new ResourceNotFoundException("Color not found with ID: " + detailsDTO.getColorId()));
                details.setColor(color);
                if (details.getSku() == null || details.getSku().isEmpty()) {
                    details.setSku(generateUniqueSku(details));
                    details.setBarcode(generateUniqueBarcode(details));
                }
                productDetailsRepository.save(details);
            }
        }

        if (productDTO.getImages() != null) {
            productImageRepository.deleteByProductProductId(product.getProductId());
            for (ProductImageDTO imageDTO : productDTO.getImages()) {
                ProductImage image = productMapper.toProductImageEntity(imageDTO);
                image.setProduct(product);
                productImageRepository.save(image);
            }
        }

        if (productDTO.getCategories() != null) {
            productCategoryRepository.deleteByProductProductId(product.getProductId());
            for (ProductCategoryDTO categoryDTO : productDTO.getCategories()) {
                Category category = categoryRepository.findById(categoryDTO.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                ProductCategory productCategory = new ProductCategory(product, category);
                productCategoryRepository.save(productCategory);
            }
        }

        if (productDTO.getFurnitureTypes() != null) {
            productFurnitureTypeRepository.deleteByProductProductId(product.getProductId());
            for (ProductFurnitureTypeDTO furnitureTypeDTO : productDTO.getFurnitureTypes()) {
                FurnitureType furnitureType = furnitureTypeRepository.findById(furnitureTypeDTO.getFurnitureTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException("FurnitureType not found"));
                ProductFurnitureType productFurnitureType = new ProductFurnitureType(product, furnitureType);
                productFurnitureTypeRepository.save(productFurnitureType);
            }
        }

        if (productDTO.getFunctions() != null) {
            productFunctionRepository.deleteByProductProductId(product.getProductId());
            for (ProductFunctionDTO functionDTO : productDTO.getFunctions()) {
                Functions function = functionRepository.findById(functionDTO.getFunctionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Function not found"));
                ProductFunction productFunction = new ProductFunction(product, function);
                productFunctionRepository.save(productFunction);
            }
        }

        if (productDTO.getProductLocations() != null) {
            productLocationsRepository.deleteByProductProductId(product.getProductId());
            for (ProductLocationsDTO locationDTO : productDTO.getProductLocations()) {
                Locations location = locationRepository.findById(locationDTO.getLocationId())
                        .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
                ProductLocations productLocation = new ProductLocations();
                productLocation.setProduct(product);
                productLocation.setLocation(location);
                productLocationsRepository.save(productLocation);
            }
        }

        if (productDTO.getDiscount() != null) {
            discountRepository.deleteByProductProductId(product.getProductId());
            Discount discount = productMapper.toDiscountEntity(productDTO.getDiscount());
            discount.setProduct(product);
            discount.setActive(productDTO.getDiscount().isActive());
            discountRepository.save(discount);
        }
    }

    private void updateRelatedEntities(Product product, ProductDTO productDTO) {
        saveRelatedEntities(product, productDTO);
    }

    public BigDecimal calculateFinalPrice(Product product, Discount discount) {
        if (discount == null || !discount.isActive() || (discount.getEndDate() != null && discount.getEndDate().isBefore(LocalDateTime.now()))) {
            return product.getPrice();
        }
        if (discount.getDiscountType() == Discount.DiscountType.PERCENTAGE) {
            return product.getPrice().multiply(BigDecimal.ONE.subtract(discount.getDiscountValue().divide(BigDecimal.valueOf(100))));
        } else if (discount.getDiscountType() == Discount.DiscountType.FIXED_AMOUNT) {
            return product.getPrice().subtract(discount.getDiscountValue());
        }
        return product.getPrice();
    }

    public Page<ProductDTO> getFeaturedProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(product -> {
            ProductDTO dto = productMapper.toProductDTO(product);
            dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
            dto.setImages(productMapper.mapProductImages(product.getImages()));
            dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
            dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
            dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
            dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
            Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
            dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
            dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
            dto.setDiscountedPrice(calculateFinalPrice(product, discount));
            return dto;
        });
    }

    public Page<ProductDTO> getSuggestedProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(product -> {
            ProductDTO dto = productMapper.toProductDTO(product);
            dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
            dto.setImages(productMapper.mapProductImages(product.getImages()));
            dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
            dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
            dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
            dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
            Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
            dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
            dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
            dto.setDiscountedPrice(calculateFinalPrice(product, discount));
            return dto;
        });
    }

    public Page<ProductDTO> getNewestProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable); // Sửa để Pageable xử lý sort
        return products.map(product -> {
            ProductDTO dto = productMapper.toProductDTO(product);
            dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
            dto.setImages(productMapper.mapProductImages(product.getImages()));
            dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
            dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
            dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
            dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
            Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
            dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
            dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
            dto.setDiscountedPrice(calculateFinalPrice(product, discount));
            return dto;
        });
    }

    public Page<ProductDTO> getDealProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        List<ProductDTO> dtoList = products.getContent().stream()
                .map(product -> {
                    ProductDTO dto = productMapper.toProductDTO(product);
                    Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
                    dto.setDiscount(discount != null ? productMapper.toDiscountDTO(discount) : null);
                    dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
                    dto.setImages(productMapper.mapProductImages(product.getImages()));
                    dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
                    dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
                    dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
                    dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
                    dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
                    dto.setDiscountedPrice(calculateFinalPrice(product, discount));
                    return dto;
                })
                .sorted((a, b) -> a.getDiscountedPrice().compareTo(b.getDiscountedPrice()))
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, products.getTotalElements());
    }

    public Page<ProductDTO> getPromotionalProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        List<ProductDTO> dtoList = products.getContent().stream()
                .map(product -> {
                    ProductDTO dto = productMapper.toProductDTO(product);
                    Discount discount = discountRepository.findByProductProductIdAndIsActiveTrue(product.getProductId()).orElse(null);
                    if (discount != null) {
                        dto.setDiscount(productMapper.toDiscountDTO(discount));
                        dto.setDiscountedPrice(calculateFinalPrice(product, discount));
                    }
                    dto.setProductDetails(productMapper.mapProductDetails(product.getProductDetails()));
                    dto.setImages(productMapper.mapProductImages(product.getImages()));
                    dto.setProductLocations(productMapper.mapProductLocations(product.getProductLocations()));
                    dto.setCategories(productMapper.mapProductCategories(product.getCategories()));
                    dto.setFurnitureTypes(productMapper.mapProductFurnitureTypes(product.getFurnitureTypes()));
                    dto.setFunctions(productMapper.mapProductFunctions(product.getFunctions()));
                    dto.setRatingCount((int) productDetailsRepository.countByProductProductId(product.getProductId()));
                    return dto;
                })
                .filter(dto -> dto.getDiscount() != null)
                .sorted((a, b) -> a.getDiscountedPrice().compareTo(b.getDiscountedPrice()))
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, products.getTotalElements());
    }

    private String normalizeString(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
    }

    private String generateUniqueSku(ProductDetails productDetails) {
        if (productDetails == null || productDetails.getProduct() == null) {
            throw new IllegalArgumentException("ProductDetails or Product cannot be null");
        }

        String productPrefix = "PRO";
        String categoryPrefix = "CAT";
        String woodTypePrefix = "WOD";
        String colorPrefix = "COL";

        String productName = productDetails.getProduct().getProductName();
        if (productName != null && !productName.isEmpty()) {
            productPrefix = normalizeString(productName).substring(0, Math.min(3, productName.length()));
        } else {
            productPrefix = "P" + productDetails.getProduct().getProductId();
        }

        if (productDetails.getProduct().getWoodType() != null) {
            String woodTypeName = productDetails.getProduct().getWoodType().getWoodTypeName();
            if (woodTypeName != null && !woodTypeName.isEmpty()) {
                woodTypePrefix = normalizeString(woodTypeName).substring(0, Math.min(3, woodTypeName.length()));
            }
        }

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
            isUnique = productDetailsRepository.findBySku(sku).isEmpty();
        } while (!isUnique);

        return sku;
    }

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
            isUnique = productDetailsRepository.findByBarcode(barcode).isEmpty();
        } while (!isUnique);

        return barcode;
    }
}