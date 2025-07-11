package com.example.backend.RestController;

import com.example.backend.entities.PriceRange;
import com.example.backend.repository.irepo.IPriceRangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/priceRanges")
public class PriceRangeRestController {
    @Autowired
    private IPriceRangeService priceRangeService;

    @GetMapping
    public ResponseEntity<Iterable<PriceRange>> getAllPriceRanges() {
        return ResponseEntity.ok(priceRangeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PriceRange> getPriceRangeById(@PathVariable Integer id) {
        return priceRangeService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PriceRange> createPriceRange(@RequestBody PriceRange priceRange) {
        try {
            PriceRange saved = priceRangeService.save(priceRange);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PriceRange> updatePriceRange(@PathVariable Integer id, @RequestBody PriceRange priceRange) {
        priceRange.setPriceRangeId(id);
        try {
            PriceRange updated = priceRangeService.save(priceRange);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePriceRange(@PathVariable Integer id) {
        priceRangeService.remove(id);
        return ResponseEntity.ok().build();
    }
}
