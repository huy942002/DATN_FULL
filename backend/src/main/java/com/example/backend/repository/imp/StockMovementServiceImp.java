package com.example.backend.repository.imp;

import com.example.backend.entities.StockMovement;
import com.example.backend.repository.irepo.IStockMovementService;
import com.example.backend.repository.repo.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StockMovementServiceImp implements IStockMovementService {
    @Autowired
    private StockMovementRepository stockMovementRepository;
    @Override
    public Iterable<StockMovement> findAll() {
        return stockMovementRepository.findAll();
    }

    @Override
    public Optional<StockMovement> findById(Integer id) {
        return stockMovementRepository.findById(id);
    }

    @Override
    public StockMovement save(StockMovement stockMovement) {
        return stockMovementRepository.save(stockMovement);
    }

    @Override
    public void remove(Integer id) {
        stockMovementRepository.deleteById(id);
    }
}
