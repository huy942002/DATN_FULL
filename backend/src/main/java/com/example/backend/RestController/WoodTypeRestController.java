package com.example.backend.RestController;

import com.example.backend.entities.WoodType;
import com.example.backend.repository.irepo.IWoodTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/woodtypes")
public class WoodTypeRestController {
    @Autowired
    private IWoodTypeService woodTypeService;

    // Lấy toàn bộ danh sách WoodTypes
    @GetMapping
    public ResponseEntity<Iterable<WoodType>> getAllWoodTypes() {
        return ResponseEntity.ok(woodTypeService.findAll());
    }

    // Lấy WoodType theo ID
    @GetMapping("/{id}")
    public ResponseEntity<WoodType> getWoodTypeById(@PathVariable Integer id) {
        System.out.println(id+"id");
        Optional<WoodType> woodType = woodTypeService.findById(id);
        return woodType.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo WoodType mới
    @PostMapping
    public ResponseEntity<WoodType> createWoodType(@RequestBody WoodType woodType) {
        try {
            WoodType savedWoodType = woodTypeService.save(woodType);
            return ResponseEntity.ok(savedWoodType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Cập nhật WoodType
    @PutMapping("/{id}")
    public ResponseEntity<WoodType> updateWoodType(@PathVariable Integer id, @RequestBody WoodType woodType) {
        Optional<WoodType> existing = woodTypeService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        woodType.setWoodTypeId(id);
        try {
            WoodType updatedWoodType = woodTypeService.save(woodType);
            return ResponseEntity.ok(updatedWoodType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Xóa WoodType (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWoodType(@PathVariable Integer id) {
        Optional<WoodType> woodType = woodTypeService.findById(id);
        if (woodType.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        woodTypeService.remove(id);
        return ResponseEntity.ok().build();
    }
}
