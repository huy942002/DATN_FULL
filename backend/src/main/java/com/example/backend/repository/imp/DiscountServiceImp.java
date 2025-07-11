package com.example.backend.repository.imp;

import com.example.backend.entities.Discount;
import com.example.backend.dto.DiscountDTO;
import com.example.backend.repository.irepo.IDiscountService;
import com.example.backend.repository.repo.DiscountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiscountServiceImp implements IDiscountService {
    private static final Logger logger = LoggerFactory.getLogger(DiscountServiceImp.class);

    @Autowired
    private DiscountRepository discountRepository;

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

    @Override
    public Iterable<Discount> findAll() {
        try {
            return discountRepository.findAll();
        } catch (Exception e) {
            logger.error("Error fetching discounts: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<DiscountDTO> findAll(Pageable pageable) {
        try {
            Page<Discount> discountPage = discountRepository.findAll(pageable);
            List<DiscountDTO> discountDTOs = discountPage.getContent().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
            return new PageImpl<>(discountDTOs, pageable, discountPage.getTotalElements());
        } catch (Exception e) {
            logger.error("Error fetching discounts: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch discounts", e);
        }
    }

    @Override
    public Optional<Discount> findById(Integer id) {
        try {
            return discountRepository.findById(id);
        } catch (Exception e) {
            logger.error("Error finding discount by ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to find discount", e);
        }
    }

    @Override
    public Discount save(Discount discount) {
        try {
            return discountRepository.save(discount);
        } catch (Exception e) {
            logger.error("Error saving discount: {}", e.getMessage());
            throw new RuntimeException("Failed to save discount", e);
        }
    }

    @Override
    public void remove(Integer id) {
        try {
            discountRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Error removing discount with ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to remove discount", e);
        }
    }

    @Override
    public Optional<Discount> findActiveDiscountByCode(String code) {
        try {
            return discountRepository.findActiveDiscounts().stream()
                    .filter(d -> d.getDiscountId().toString().equals(code))
                    .findFirst();
        } catch (Exception e) {
            logger.error("Error finding active discount by code {}: {}", code, e.getMessage());
            throw new RuntimeException("Failed to find active discount", e);
        }
    }
}