package com.example.backend.RestController;

import com.example.backend.entities.ProductColor;
import com.example.backend.repository.irepo.IProductColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/product-colors")
public class ProductColorRestController {

    @Autowired
    private IProductColorService productColorService;

    @GetMapping
    public ResponseEntity<Iterable<ProductColor>> getAllProductColors() {
        Iterable<ProductColor> productColors = productColorService.findAll();
        return new ResponseEntity<>(productColors, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductColor> createProductColor(@RequestBody ProductColor productColor) {
        return ResponseEntity.ok(productColorService.save(productColor));
    }

    private static final String UPLOAD_DIR = "src/main/resources/static/images/colors/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String folder = "src/main/resources/static/images/colors/";
        try {
            // Tạo tên tệp mới với UUID để đảm bảo duy nhất
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            // Tạo thư mục nếu chưa có
            Path path = Paths.get(folder + newFilename);
            Files.createDirectories(path.getParent());

            // Ghi tệp vào thư mục
            byte[] bytes = file.getBytes();
            Files.write(path, bytes);

            // Trả về đường dẫn URL hình ảnh
            String imageUrl = newFilename;
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("File upload failed");
        }
    }
    @GetMapping("/images/colors/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        System.out.println(filename);
        try {
            Path path = Paths.get(UPLOAD_DIR + filename);
            byte[] imageBytes = Files.readAllBytes(path);
            return ResponseEntity.ok().body(imageBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body(null);
        }
    }


    @PutMapping("/update")
    public ResponseEntity<ProductColor> updateProductColor(@RequestBody ProductColor productColor) {
            System.out.println(productColor.toString());
        return ResponseEntity.ok(productColorService.updateProductColor(productColor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductColor(@PathVariable int id) {
        productColorService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
