package com.example.backend.RestController;

import com.example.backend.entities.Material;
import com.example.backend.entities.ProductColor;
import com.example.backend.repository.irepo.IMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/materials")
public class MaterialRestController {

    @Autowired
    private IMaterialService materialService;

    // Tạo hoặc cập nhật Material (ở ví dụ này dùng POST cho cả create/update)
    @PostMapping("/")
    public ResponseEntity<Material> createOrUpdateMaterial(@RequestBody Material material) {
        Material savedMaterial = materialService.save(material);
        return new ResponseEntity<>(savedMaterial, HttpStatus.CREATED);
    }

    // Lấy danh sách Material
    @GetMapping("/")
    public ResponseEntity<Iterable<Material>> getAllMaterials() {
        Iterable<Material> materials = materialService.findAll();
        return new ResponseEntity<>(materials, HttpStatus.OK);
    }

    // Lấy Material theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(@PathVariable int id) {
        Optional<Material> material = materialService.findById(id);
        return material.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update")
    public ResponseEntity<Material> updateMaterial(@RequestBody Material material) {
        return ResponseEntity.ok(materialService.updateMaterial(material));
    }

    // Xóa Material theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable int id) {
        materialService.remove(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}