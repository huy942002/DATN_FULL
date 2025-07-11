package com.example.backend.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class UploadRestController {

    private static final String UPLOAD_DIR = "src/main/resources/static/images/";

    @GetMapping("/public/images/colors/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        System.out.println(filename);
        try {
            Path path = Paths.get(UPLOAD_DIR+"/colors/" + filename);
            byte[] imageBytes = Files.readAllBytes(path);
            return ResponseEntity.ok().body(imageBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body(null);
        }
    }

//
//    @PostMapping("/api/admin/upload")
//    public ResponseEntity<?> upload(@PathParam("file") MultipartFile file) {
//        String time = String.valueOf(System.currentTimeMillis());
//        uploadService.save(file,time);
//        return ResponseEntity.ok(time);
//    }
}
