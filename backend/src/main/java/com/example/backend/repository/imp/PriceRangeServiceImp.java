package com.example.backend.repository.imp;

import com.example.backend.entities.PriceRange;
import com.example.backend.repository.irepo.IPriceRangeService;
import com.example.backend.repository.repo.PriceRangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PriceRangeServiceImp implements IPriceRangeService {
    @Autowired
    private PriceRangeRepository priceRangeRepository;

    @Override
    public Iterable<PriceRange> findAll() {
        return priceRangeRepository.findAll();
    }

    @Override
    public Optional<PriceRange> findById(Integer id) {
        return priceRangeRepository.findById(id);
    }

    @Override
    public PriceRange save(PriceRange priceRange) {
        Optional<PriceRange> existing = priceRangeRepository.findByPriceRangeNameAndIsActiveTrue(priceRange.getPriceRangeName());
        if (existing.isPresent() && !existing.get().getPriceRangeId().equals(priceRange.getPriceRangeId())) {
            throw new IllegalArgumentException("Price range name already exists");
        }
        return priceRangeRepository.save(priceRange);
    }

    @Override
    public void remove(Integer id) {
        priceRangeRepository.findById(id).ifPresent(priceRange -> {
            priceRange.setActive(false);
            priceRangeRepository.save(priceRange);
        });
    }
}
