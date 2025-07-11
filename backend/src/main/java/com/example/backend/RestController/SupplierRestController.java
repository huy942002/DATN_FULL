package com.example.backend.RestController;

import com.example.backend.dto.SupplierDTO;
import com.example.backend.entities.Supplier;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.repo.SupplierRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/suppliers")
public class SupplierRestController {
    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private ProductMapper productMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SupplierDTO createSupplier(@Valid @RequestBody SupplierDTO supplierDTO) {
        Supplier supplier = productMapper.toSupplierEntity(supplierDTO);
        supplier = supplierRepository.save(supplier);
        return productMapper.toSupplierDTO(supplier);
    }

    @GetMapping
    public Page<SupplierDTO> getAllSuppliers(Pageable pageable) {
        return supplierRepository.findAll(pageable)
                .map(supplier -> productMapper.toSupplierDTO(supplier));
    }

    @GetMapping("/{id}")
    public SupplierDTO getSupplierById(@PathVariable Integer id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));
        return productMapper.toSupplierDTO(supplier);
    }

    @PutMapping("/{id}")
    public SupplierDTO updateSupplier(@PathVariable Integer id, @Valid @RequestBody SupplierDTO supplierDTO) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));
        supplier.setSupplierName(supplierDTO.getSupplierName());
        supplier.setDescription(supplierDTO.getDescription());
        supplier.setContactInfo(supplierDTO.getContactInfo());
        supplier.setAddress(supplierDTO.getAddress());
        supplier.setActive(supplierDTO.isActive());
        supplier.setUpdatedAt(java.time.LocalDateTime.now());
        supplier = supplierRepository.save(supplier);
        return productMapper.toSupplierDTO(supplier);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSupplier(@PathVariable Integer id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));
        supplier.setActive(false);
        supplierRepository.save(supplier);
    }
}