package com.example.backend.RestController;

import com.example.backend.entities.Locations;
import com.example.backend.repository.irepo.ILocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/locations")
public class LocationRestController {
    @Autowired
    private ILocationService locationService;

    // Lấy toàn bộ danh sách Locations
    @GetMapping
    public ResponseEntity<Iterable<Locations>> getAllLocations() {
        return ResponseEntity.ok(locationService.findAll());
    }
    // Lấy Location theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Locations> getLocationById(@PathVariable Integer id) {
        Optional<Locations> location = locationService.findById(id);
        return location.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo Location mới
    @PostMapping
    public ResponseEntity<Locations> createLocation(@RequestBody Locations location) {
        try {
            Locations savedLocation = locationService.save(location);
            return ResponseEntity.ok(savedLocation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Cập nhật Location
    @PutMapping("/{id}")
    public ResponseEntity<Locations> updateLocation(@PathVariable Integer id, @RequestBody Locations location) {
        Optional<Locations> existing = locationService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        location.setLocationId(id);
        try {
            Locations updatedLocation = locationService.save(location);
            return ResponseEntity.ok(updatedLocation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Xóa Location (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Integer id) {
        Optional<Locations> location = locationService.findById(id);
        if (location.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        locationService.remove(id);
        return ResponseEntity.ok().build();
    }
}
