package com.example.backend.repository.irepo;

import com.example.backend.entities.Discount;
import com.example.backend.dto.DiscountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface IDiscountService extends IGeneralService<Discount> {
    Page<DiscountDTO> findAll(Pageable pageable);
    Optional<Discount> findActiveDiscountByCode(String code);
}
