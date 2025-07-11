package com.example.backend.RestController;

import com.example.backend.dto.DiscountDTO;
import com.example.backend.entities.Discount;
import com.example.backend.repository.imp.DiscountServiceImp;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/discounts")
public class DiscountRestController {
    @Autowired
    private DiscountServiceImp discountService;

    // Utility method to map Discount to DiscountDTO
    private DiscountDTO toDTO(Discount discount) {
        DiscountDTO dto = new DiscountDTO();
        dto.setDiscountId(discount.getDiscountId());
        dto.setDiscountType(discount.getDiscountType());
        dto.setDiscountValue(discount.getDiscountValue());
        dto.setStartDate(discount.getStartDate());
        dto.setEndDate(discount.getEndDate());
        dto.setActive(discount.isActive());
        dto.setCreatedAt(discount.getCreatedAt());
        dto.setUpdatedAt(discount.getUpdatedAt());
        return dto;
    }

    // Utility method to map DiscountDTO to Discount
    private Discount toEntity(DiscountDTO dto) {
        Discount discount = new Discount();
        discount.setDiscountId(dto.getDiscountId());
        discount.setDiscountType(dto.getDiscountType());
        discount.setDiscountValue(dto.getDiscountValue());
        discount.setStartDate(dto.getStartDate());
        discount.setEndDate(dto.getEndDate());
        discount.setActive(dto.isActive());
        discount.setCreatedAt(dto.getCreatedAt());
        discount.setUpdatedAt(dto.getUpdatedAt());
        return discount;
    }

    @GetMapping
    public ResponseEntity<Page<DiscountDTO>> getAllDiscounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<DiscountDTO> discounts = discountService.findAll(pageable);
            return new ResponseEntity<>(discounts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscountDTO> getDiscountById(@PathVariable int id) {
        Optional<Discount> discount = discountService.findById(id);
        return discount.map(d -> ResponseEntity.ok(toDTO(d)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DiscountDTO> createDiscount(@Valid @RequestBody DiscountDTO discountDTO) {
        try {
            Discount discount = toEntity(discountDTO);
            Discount savedDiscount = discountService.save(discount);
            return new ResponseEntity<>(toDTO(savedDiscount), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiscountDTO> updateDiscount(@PathVariable int id, @Valid @RequestBody DiscountDTO discountDTO) {
        if (!discountService.findById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        try {
            Discount discount = toEntity(discountDTO);
            discount.setDiscountId(id); // Ensure ID is set
            Discount updatedDiscount = discountService.save(discount);
            return ResponseEntity.ok(toDTO(updatedDiscount));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable int id) {
        if (!discountService.findById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        try {
            discountService.remove(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/apply")
    public ResponseEntity<DiscountDTO> applyDiscount(@RequestBody DiscountApplyRequest request) {
        Optional<Discount> discount = discountService.findActiveDiscountByCode(request.getCode());
        return discount.map(d -> ResponseEntity.ok(toDTO(d)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

class DiscountApplyRequest {
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}