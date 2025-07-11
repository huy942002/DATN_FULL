package com.example.backend.repository.imp;

import com.example.backend.entities.FurnitureType;
import com.example.backend.repository.irepo.IFurnitureTypeService;
import com.example.backend.repository.repo.FurnitureTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FurnitureTypeServiceImp implements IFurnitureTypeService {
    @Autowired
    private FurnitureTypeRepository furnitureTypeRepository;

    @Override
    public Iterable<FurnitureType> findAll() {
        return furnitureTypeRepository.findAll();
    }

    @Override
    public Optional<FurnitureType> findById(Integer id) {
        return furnitureTypeRepository.findById(id);
    }

    @Override
    public FurnitureType save(FurnitureType furnitureType) {
        Optional<FurnitureType> existing = furnitureTypeRepository.findByTypeNameAndIsActiveTrue(furnitureType.getTypeName());
        if (existing.isPresent() && !existing.get().getFurnitureTypeId().equals(furnitureType.getFurnitureTypeId())) {
            throw new IllegalArgumentException("Furniture type name already exists");
        }
        return furnitureTypeRepository.save(furnitureType);
    }

    @Override
    public void remove(Integer id) {
        furnitureTypeRepository.findById(id).ifPresent(furnitureType -> {
            furnitureType.setActive(false);
            furnitureTypeRepository.save(furnitureType);
        });
    }
}
