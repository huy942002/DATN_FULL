package com.example.backend.repository.imp;

import com.example.backend.entities.Material;
import com.example.backend.repository.irepo.IMaterialService;
import com.example.backend.repository.repo.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
@Service
public class MaterialServiceImp implements IMaterialService {
    @Autowired
    private MaterialRepository materialRepository;
    @Override
    public Iterable<Material> findAll() {
        return materialRepository.findAll();
    }

    @Override
    public Optional<Material> findById(Integer id) {
        return materialRepository.findById(id);
    }

    @Override
    public Material save(Material material) {
        return materialRepository.save(material);
    }

    @Override
    public void remove(Integer id) {
        materialRepository.deleteById(id);
    }

    @Override
    public Material updateMaterial(Material material) {
        return materialRepository.save(material);
    }
}
