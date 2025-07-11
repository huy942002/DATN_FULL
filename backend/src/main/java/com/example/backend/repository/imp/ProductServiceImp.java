//package com.example.backend.repository.imp;
//
//import com.example.backend.dto.ProductDTO;
//import com.example.backend.dto.ReferenceDTO;
//import com.example.backend.entities.*;
//import com.example.backend.repository.irepo.IProductService;
//import com.example.backend.repository.repo.*;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//
//@Service
//public class ProductServiceImp implements IProductService {
//    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImp.class);
//
//    @Autowired
//    private ProductRepository productRepository;
//    @Autowired
//    private CategoryRepository categoryRepository;
//    @Autowired
//    private FunctionRepository functionRepository;
//    @Autowired
//    private StyleRepository styleRepository;
//    @Autowired
//    private WoodTypeRepository woodTypeRepository;
//    @Autowired
//    private LocationRepository locationRepository;
//    @Autowired
//    private CraftingTechniqueRepository techniqueRepository;
//    @Autowired
//    private PriceRangeRepository priceRangeRepository;
//    @Autowired
//    private FurnitureTypeRepository furnitureTypeRepository;
//
//    @Override
//    public Iterable<Product> findAll() {
//        logger.info("Fetching all active products");
//        return productRepository.findByIsActiveTrue();
//    }
//
//    @Override
//    public Optional<Product> findById(Integer id) {
//        logger.info("Fetching product by ID: {}", id);
//        return productRepository.findById(id);
//    }
//
//    @Override
//    public Product save(Product product) {
//        logger.info("Saving product: {}", product.getProductName());
//        return productRepository.save(product);
//    }
//
//    @Override
//    public void remove(Integer id) {
//        logger.info("Soft deleting product with ID: {}", id);
//        Optional<Product> productOpt = productRepository.findById(id);
//        if (productOpt.isPresent()) {
//            Product product = productOpt.get();
//            product.setActive(false);
//            productRepository.save(product);
//        } else {
//            logger.warn("Product not found for ID: {}", id);
//            throw new RuntimeException("Product not found");
//        }
//    }
//
//    public Page<ProductDTO> findAllProductDTO(Pageable pageable, String search, Boolean isActive) {
//        logger.info("Fetching products with pagination, search: {}, isActive: {}", search, isActive);
//        if (search != null && !search.isEmpty()) {
//            return productRepository.findByProductNameContainingIgnoreCaseAndIsActive(isActive, search, pageable)
//                    .map(this::convertToDTO);
//        }
//        return productRepository.findByIsActiveTrue(pageable).map(this::convertToDTO);
//    }
//
//    @Override
//    public ProductDTO findByIdProductDTO(Integer id) {
//        logger.info("Fetching product DTO by ID: {}", id);
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> {
//                    logger.error("Product not found for ID: {}", id);
//                    return new RuntimeException("Product not found");
//                });
//        return convertToDTO(product);
//    }
//
//    @Override
//    public ProductDTO create(ProductDTO productDTO) {
//        logger.info("Creating new product: {}", productDTO.getProductName());
//        Product product = new Product();
//        mapDTOToEntity(productDTO, product);
//        Product savedProduct = productRepository.save(product);
//        return convertToDTO(savedProduct);
//    }
//
//    @Override
//    public ProductDTO update(Integer id, ProductDTO productDTO) {
//        logger.info("Updating product ID: {}", id);
//        Product product = productRepository.findById(id)
//                .orElseThrow(() -> {
//                    logger.error("Product not found for ID: {}", id);
//                    return new RuntimeException("Product not found");
//                });
//        mapDTOToEntity(productDTO, product);
//        Product updatedProduct = productRepository.save(product);
//        return convertToDTO(updatedProduct);
//    }
//
//    @Override
//    public void delete(Integer id) {
//        logger.info("Soft deleting product with ID: {}", id);
//        remove(id); // Thống nhất sử dụng soft delete
//    }
//
//    private ProductDTO convertToDTO(Product product) {
//        return new ProductDTO(
//                product.getProductId(),
//                product.getProductName(),
//                product.getDescription(),
//                product.getPrice(),
//                product.getWeight(),
//                product.getDimensions(),
//                product.getProductStatus(),
//                product.isActive(),
//                product.getImageUrl(),
////                product.getCategory() != null ? new ReferenceDTO(product.getCategory().getCategoryId(), product.getCategory().getCategoryName()) : null,
////                product.getFunction() != null ? new ReferenceDTO(product.getFunction().getFunctionId(), product.getFunction().getFunctionName()) : null,
//                product.getStyle() != null ? new ReferenceDTO(product.getStyle().getStyleId(), product.getStyle().getStyleName()) : null,
//                product.getWoodType() != null ? new ReferenceDTO(product.getWoodType().getWoodTypeId(), product.getWoodType().getWoodTypeName()) : null,
//                product.getLocation() != null ? new ReferenceDTO(product.getLocation().getLocationId(), product.getLocation().getLocationName()) : null,
//                product.getTechnique() != null ? new ReferenceDTO(product.getTechnique().getTechniqueId(), product.getTechnique().getTechniqueName()) : null,
//                product.getPriceRange() != null ? new ReferenceDTO(product.getPriceRange().getPriceRangeId(), product.getPriceRange().getPriceRangeName()) : null
////                product.getFurnitureType() != null ? new ReferenceDTO(product.getFurnitureType().getFurnitureTypeId(), product.getFurnitureType().getTypeName()) : null
//        );
//    }
//
//    private void mapDTOToEntity(ProductDTO DTO, Product product) {
//        product.setProductName(DTO.getProductName());
//        product.setDescription(DTO.getDescription());
//        product.setPrice(DTO.getPrice());
//        product.setWeight(DTO.getWeight());
//        product.setDimensions(DTO.getDimensions());
//        product.setProductStatus(DTO.getProductStatus());
//        product.setActive(DTO.getActive());
//        product.setImageUrl(DTO.getImageUrl());
//
////        if (DTO.getCategory() != null && DTO.getCategory().getId() != null) {
////            Category category = categoryRepository.findById(DTO.getCategory().getId())
////                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
////            product.setCategory(category);
////        }
////        if (DTO.getFunction() != null && DTO.getFunction().getId() != null) {
////            Functions function = functionRepository.findById(DTO.getFunction().getId())
////                    .orElseThrow(() -> new IllegalArgumentException("Function not found"));
////            product.setFunction(function);
////        }
//        if (DTO.getStyle() != null && DTO.getStyle().getId() != null) {
//            Style style = styleRepository.findById(DTO.getStyle().getId())
//                    .orElseThrow(() -> new IllegalArgumentException("Style not found"));
//            product.setStyle(style);
//        }
//        if (DTO.getWoodType() != null && DTO.getWoodType().getId() != null) {
//            WoodType woodType = woodTypeRepository.findById(DTO.getWoodType().getId())
//                    .orElseThrow(() -> new IllegalArgumentException("WoodType not found"));
//            product.setWoodType(woodType);
//        }
//        if (DTO.getLocation() != null && DTO.getLocation().getId() != null) {
//            Locations location = locationRepository.findById(DTO.getLocation().getId())
//                    .orElseThrow(() -> new IllegalArgumentException("Location not found"));
//            product.setLocation(location);
//        }
//        if (DTO.getTechnique() != null && DTO.getTechnique().getId() != null) {
//            CraftingTechnique technique = techniqueRepository.findById(DTO.getTechnique().getId())
//                    .orElseThrow(() -> new IllegalArgumentException("Technique not found"));
//            product.setTechnique(technique);
//        }
//        if (DTO.getPriceRange() != null && DTO.getPriceRange().getId() != null) {
//            PriceRange priceRange = priceRangeRepository.findById(DTO.getPriceRange().getId())
//                    .orElseThrow(() -> new IllegalArgumentException("PriceRange not found"));
//            product.setPriceRange(priceRange);
//        }
////        if (DTO.getFurnitureType() != null && DTO.getFurnitureType().getId() != null) {
////            FurnitureType furnitureType = furnitureTypeRepository.findById(DTO.getFurnitureType().getId())
////                    .orElseThrow(() -> new IllegalArgumentException("FurnitureType not found"));
////            product.setFurnitureType(furnitureType);
////        }
//    }
//}