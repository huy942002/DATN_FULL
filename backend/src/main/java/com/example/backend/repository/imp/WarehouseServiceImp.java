package com.example.backend.repository.imp;

import com.example.backend.entities.Warehouse;
import com.example.backend.repository.irepo.IWarehouseService;
import com.example.backend.repository.repo.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class WarehouseServiceImp implements IWarehouseService {
    @Autowired
    private WarehouseRepository repository;
    @Override
    public Iterable<Warehouse> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Warehouse> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Warehouse save(Warehouse warehouse) {
        return repository.save(warehouse);
    }

    @Override
    public void remove(Integer id) {

    }
}
