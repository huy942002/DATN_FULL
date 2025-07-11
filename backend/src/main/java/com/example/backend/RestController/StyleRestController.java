package com.example.backend.RestController;

import com.example.backend.entities.Style;
import com.example.backend.repository.irepo.IStyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/styles")
public class StyleRestController {
    @Autowired
    private IStyleService styleService;

    // Lấy danh sách Styles
    @GetMapping
    public ResponseEntity<Iterable<Style>> getAllStyles() {
        return ResponseEntity.ok(styleService.findAll());
    }

    // Lấy Style theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Style> getStyleById(@PathVariable Integer id) {
        Optional<Style> style = styleService.findById(id);
        return style.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo Style mới
    @PostMapping
    public ResponseEntity<Style> createStyle(@RequestBody Style style) {
        try {
            Style savedStyle = styleService.save(style);
            return ResponseEntity.ok(savedStyle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Cập nhật Style
    @PutMapping("/{id}")
    public ResponseEntity<Style> updateStyle(@PathVariable Integer id, @RequestBody Style style) {
        Optional<Style> existing = styleService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        style.setStyleId(id);
        try {
            Style updatedStyle = styleService.save(style);
            return ResponseEntity.ok(updatedStyle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Xóa Style (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStyle(@PathVariable Integer id) {
        Optional<Style> style = styleService.findById(id);
        if (style.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        styleService.remove(id);
        return ResponseEntity.ok().build();
    }
}
