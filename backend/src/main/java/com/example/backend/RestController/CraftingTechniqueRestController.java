package com.example.backend.RestController;
import com.example.backend.entities.CraftingTechnique;
import com.example.backend.repository.irepo.ICraftingTechniqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/craftingTechniques")
public class CraftingTechniqueRestController {
    @Autowired
    private ICraftingTechniqueService craftingTechniqueService;

    @GetMapping
    public ResponseEntity<Iterable<CraftingTechnique>> getAllCraftingTechniques() {
        return ResponseEntity.ok(craftingTechniqueService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CraftingTechnique> getCraftingTechniqueById(@PathVariable Integer id) {
        return craftingTechniqueService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CraftingTechnique> createCraftingTechnique(@RequestBody CraftingTechnique craftingTechnique) {
        try {
            CraftingTechnique saved = craftingTechniqueService.save(craftingTechnique);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CraftingTechnique> updateCraftingTechnique(@PathVariable Integer id, @RequestBody CraftingTechnique craftingTechnique) {
        craftingTechnique.setTechniqueId(id);
        try {
            CraftingTechnique updated = craftingTechniqueService.save(craftingTechnique);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCraftingTechnique(@PathVariable Integer id) {
        craftingTechniqueService.remove(id);
        return ResponseEntity.ok().build();
    }
}
