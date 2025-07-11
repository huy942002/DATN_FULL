package com.example.backend.RestController;
import com.example.backend.entities.FurnitureType;
import com.example.backend.repository.irepo.IFurnitureTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/furnitureTypes")
public class FurnitureTypeRestController {
    @Autowired
    private IFurnitureTypeService furnitureTypeService;

    @GetMapping
    public ResponseEntity<Iterable<FurnitureType>> getAllFurnitureTypes() {
        return ResponseEntity.ok(furnitureTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FurnitureType> getFurnitureTypeById(@PathVariable Integer id) {
        return furnitureTypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FurnitureType> createFurnitureType(@RequestBody FurnitureType furnitureType) {
        try {
            FurnitureType saved = furnitureTypeService.save(furnitureType);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<FurnitureType> updateFurnitureType(@PathVariable Integer id, @RequestBody FurnitureType furnitureType) {
        furnitureType.setFurnitureTypeId(id);
        try {
            FurnitureType updated = furnitureTypeService.save(furnitureType);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFurnitureType(@PathVariable Integer id) {
        furnitureTypeService.remove(id);
        return ResponseEntity.ok().build();
    }
}
