package com.example.backend.RestController;

import com.example.backend.entities.Functions;
import com.example.backend.repository.irepo.IFunctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@RestController
@RequestMapping("/api/functions")
public class FunctionRestController {
    @Autowired
    private IFunctionService functionService;

    // Lấy danh sách Functions
    @GetMapping
    public ResponseEntity<Iterable<Functions>> getAllFunctions() {
        return ResponseEntity.ok(functionService.findAll());
    }

    // Lấy Function theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Functions> getFunctionById(@PathVariable Integer id) {
        Optional<Functions> function = functionService.findById(id);
        return function.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo Function mới
    @PostMapping
    public ResponseEntity<Functions> createFunction(@RequestBody Functions function) {
        try {
            Functions savedFunction = functionService.save(function);
            return ResponseEntity.ok(savedFunction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Cập nhật Function
    @PutMapping("/{id}")
    public ResponseEntity<Functions> updateFunction(@PathVariable Integer id, @RequestBody Functions function) {
        Optional<Functions> existing = functionService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        function.setFunctionId(id);
        try {
            Functions updatedFunction = functionService.save(function);
            return ResponseEntity.ok(updatedFunction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Xóa Function (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFunction(@PathVariable Integer id) {
        Optional<Functions> function = functionService.findById(id);
        if (function.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        functionService.remove(id);
        return ResponseEntity.ok().build();
    }
}
