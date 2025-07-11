package com.example.backend.RestController;

import com.example.backend.entities.*;
import com.example.backend.repository.irepo.IProductColorService;
import com.example.backend.repository.irepo.IWoodTypeService;
import com.example.backend.repository.repo.ProductDetailsRepository;
import com.example.backend.repository.repo.ProductImageRepository;
import com.example.backend.repository.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*") // Cho phép CORS từ tất cả nguồn (điều chỉnh theo nhu cầu bảo mật của bạn)
public class ImageUploadController {

    @Autowired
    private IProductColorService productColorService;

    @Autowired
    private IWoodTypeService woodTypeService;

    @Autowired
    private ProductRepository productService;

    @Autowired
    private ProductImageRepository productImageRepository;
    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Value("${image.upload.dir:src/main/resources/static/}")
    private String uploadDir;

    // Constant cho thời gian cache (1 năm)
    private static final String CACHE_CONTROL_VALUE = "public, max-age=31536000";

    // Tạo thư mục nếu nó không tồn tại
    private void ensureDirectoryExists(Path directory) throws IOException {
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }
    }

    // Tạo tên file duy nhất
    private String generateUniqueFileName(String originalFilename) {
        return UUID.randomUUID().toString() + "_" + originalFilename;
    }

    // Lưu file và trả về đường dẫn tương đối
    private String saveFile(MultipartFile file, String subDir) throws IOException {
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        Path targetLocation = Paths.get(uploadDir+"/images", subDir).toAbsolutePath().normalize();

        ensureDirectoryExists(targetLocation);

        Path filePath = targetLocation.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/images/" + subDir + "/" + fileName;
    }

    // Validate file trước khi upload
    private ResponseEntity<String> validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        // Kiểm tra loại file
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files are allowed");
        }

        // Giới hạn kích thước file (10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds maximum limit (10MB)");
        }

        return null; // Validation passed
    }

    // Upload ảnh cho ProductColor
    @PostMapping("/api/images/color/{colorId}")
    public ResponseEntity<?> uploadColorImage(@PathVariable Integer colorId, @RequestParam("file") MultipartFile file) {
        ResponseEntity<String> validationResult = validateFile(file);
        if (validationResult != null) {
            return validationResult;
        }

        try {
            String imageUrl = saveFile(file, "color");

            ProductColor color = productColorService.findById(colorId)
                    .orElseThrow(() -> new IllegalArgumentException("ProductColor not found"));
            color.setUpdatedAt(LocalDateTime.now());
            color.setImageUrl(imageUrl);
            productColorService.save(color);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/public/load")
                    .queryParam("imagePath", imageUrl.substring(1)) // Remove leading '/'
                    .toUriString();

            return ResponseEntity.ok(fileDownloadUri);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
    // Endpoint để tải bất kỳ ảnh nào dựa trên đường dẫn
    @GetMapping("/public/load")
    public ResponseEntity<Resource> loadImage(@RequestParam("imagePath") String imagePath) {
        System.out.println(imagePath);
        try {
            // Đảm bảo imagePath là hợp lệ và chỉ trỏ đến thư mục images
            Path filePath = Paths.get(uploadDir, imagePath).normalize().toAbsolutePath();
            Path uploadDirPath = Paths.get(uploadDir).toAbsolutePath();
            System.out.println(filePath);
            if (!filePath.startsWith(uploadDirPath)) {
                return ResponseEntity.status(403).build();  // Forbidden access
            }

            Resource resource;
            Path fileToServe;

            if (!Files.exists(filePath)) {
                // Trả về ảnh mặc định nếu không tìm thấy
                Path defaultFilePath = Paths.get(uploadDir, "images", "default.jpg").toAbsolutePath();
                if (!Files.exists(defaultFilePath)) {
                    return ResponseEntity.status(404).build();
                }
                fileToServe = defaultFilePath;
            } else {
                fileToServe = filePath;
            }

            resource = new UrlResource(fileToServe.toUri());

            if (!resource.exists()) {
                return ResponseEntity.status(404).build();
            }

            // Xác định content type
            String contentType = Files.probeContentType(fileToServe);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Thiết lập cache headers để tối ưu hiệu suất
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileToServe.getFileName().toString() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, CACHE_CONTROL_VALUE)
                    .header(HttpHeaders.PRAGMA, "cache")
                    .header(HttpHeaders.EXPIRES, "31536000")
                    .body(resource);

        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Upload ảnh cho WoodType
    @PostMapping("/api/images/woodtype/{woodTypeId}")
    public ResponseEntity<?> uploadWoodTypeImage(@PathVariable Integer woodTypeId, @RequestParam("file") MultipartFile file) {
        ResponseEntity<String> validationResult = validateFile(file);
        if (validationResult != null) {
            return validationResult;
        }

        try {
            String imageUrl = saveFile(file, "WoodType");
            WoodType woodType = woodTypeService.findById(woodTypeId)
                    .orElseThrow(() -> new IllegalArgumentException("WoodType not found"));
            woodType.setNaturalImageUrl(imageUrl);
            woodTypeService.save(woodType);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/public/load")
                    .queryParam("imagePath", imageUrl.substring(1)) // Remove leading '/'
                    .toUriString();

            return ResponseEntity.ok(fileDownloadUri);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Upload ảnh đơn cho Product
    @PostMapping("/api/images/product/{productId}")
    public ResponseEntity<?> uploadProductImage(
            @PathVariable Integer productId,
            @RequestParam("file") MultipartFile file) {

        ResponseEntity<String> validationResult = validateFile(file);
        if (validationResult != null) {
            return validationResult;
        }

        try {
            String imageUrl = saveFile(file, "products");

            Product product = productService.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            // Update Product's imageUrl (existing behavior)
            product.setImageUrl(imageUrl);
            productService.save(product);

            // Create a new ProductImage entry
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setImageUrl(imageUrl);
            productImage.setMainImage(true); // Set as non-main image
            productImage.setCreatedAt(LocalDateTime.now());
            productImage.setUpdatedAt(LocalDateTime.now());
            productImage.setActive(true);
            productImageRepository.save(productImage);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/public/load")
                    .queryParam("imagePath", imageUrl.substring(1)) // Remove leading '/'
                    .toUriString();

            return ResponseEntity.ok(fileDownloadUri);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Upload danh sách ảnh cho Product
    @PostMapping("/api/images/product/{productId}/bulk")
    public ResponseEntity<?> uploadProductImages(
            @PathVariable Integer productId,
            @RequestParam("files") MultipartFile[] files) {

        try {
            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest().body("No files uploaded");
            }

            Product product = productService.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            List<String> uploadedFileUrls = new ArrayList<>();

            // Keep existing main image status (no longer resetting all to false)
            // We won't set Product's imageUrl since no image is main
            int count = 0;
            // Process each file
            for (MultipartFile file : files) {
                ResponseEntity<String> validationResult = validateFile(file);
                if (validationResult != null) {
                    continue; // Skip invalid files
                }

                String imageUrl = saveFile(file, "products");

                ProductImage productImage = new ProductImage();
                productImage.setProduct(product);
                productImage.setImageUrl(imageUrl);
                if (count==0){
                    productImage.setMainImage(true);
                    product.setImageUrl(imageUrl);
                    productService.save(product);
                    count++;
                }else{
                    productImage.setMainImage(false);
                }
                 // All images are non-main
                productImage.setCreatedAt(LocalDateTime.now());
                productImage.setUpdatedAt(LocalDateTime.now());
                productImage.setActive(true);

                productImageRepository.save(productImage);

                String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/public/load")
                        .queryParam("imagePath", imageUrl.substring(1)) // Remove leading '/'
                        .toUriString();

                uploadedFileUrls.add(fileDownloadUri);
            }

            if (uploadedFileUrls.isEmpty()) {
                return ResponseEntity.badRequest().body("No valid files uploaded");
            }

            return ResponseEntity.ok(uploadedFileUrls);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload images: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Upload ảnh đơn cho ProductDetails
    @PostMapping("/api/images/product-detail/{productDetailsId}")
    public ResponseEntity<?> uploadProductColorDetailImage(
            @PathVariable Integer productDetailsId,
            @RequestParam("file") MultipartFile file) {
        System.out.println("tải ảnh");
        ResponseEntity<String> validationResult = validateFile(file);
        if (validationResult != null) {
            return validationResult;
        }

        try {
            String imageUrl = saveFile(file, "products");

            // Find the ProductDetails by ID
            ProductDetails productDetails = productDetailsRepository.findById(productDetailsId)
                    .orElseThrow(() -> new IllegalArgumentException("ProductDetails not found"));

            // Get the associated Product
            Product product = productDetails.getProduct();
            if (product == null) {
                return ResponseEntity.status(400).body("ProductDetails is not associated with a Product");
            }

            // Update ProductDetails's imageUrl
            productDetails.setImageUrl(imageUrl);
            productDetails.setUpdatedAt(LocalDateTime.now()); // Update timestamp
            productDetailsRepository.save(productDetails);

            // Create a ProductImage entry
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setImageUrl(imageUrl);
            productImage.setMainImage(false); // Align with bulk upload behavior: no main image
            productImage.setCreatedAt(LocalDateTime.now());
            productImage.setUpdatedAt(LocalDateTime.now());
            productImage.setActive(true);
            productImageRepository.save(productImage);

            // Generate downloadable URL
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/public/load")
                    .queryParam("imagePath", imageUrl.substring(1)) // Remove leading '/'
                    .toUriString();

            return ResponseEntity.ok(fileDownloadUri);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Xóa ProductImage theo ID
    @DeleteMapping("/api/images/product/image/{imageId}")
    public ResponseEntity<?> deleteProductImage(@PathVariable Integer imageId) {
        try {
            ProductImage image = productImageRepository.findById(imageId)
                    .orElseThrow(() -> new IllegalArgumentException("ProductImage not found"));

            // Xóa file vật lý nếu cần
            String relativePath = image.getImageUrl();
            if (relativePath != null && relativePath.startsWith("/images/")) {
                relativePath = relativePath.substring("/images/".length());
                Path filePath = Paths.get(uploadDir, relativePath).normalize();
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            }

            // Xóa record trong database
            productImageRepository.delete(image);

            return ResponseEntity.ok("Image deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to delete image file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Cập nhật thuộc tính mainImage của ProductImage
    @PutMapping("/api/images/product/image/{imageId}/setMain")
    public ResponseEntity<?> setMainImage(@PathVariable Integer imageId) {
        try {
            ProductImage image = productImageRepository.findById(imageId)
                    .orElseThrow(() -> new IllegalArgumentException("ProductImage not found"));

            // Đặt tất cả các hình của sản phẩm này không phải hình chính
            List<ProductImage> productImages = productImageRepository.findByProduct(image.getProduct());
            for (ProductImage img : productImages) {
                img.setMainImage(false);
                productImageRepository.save(img);
            }

            // Đặt hình này là hình chính
            image.setMainImage(true);
            productImageRepository.save(image);

            return ResponseEntity.ok("Main image set successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}