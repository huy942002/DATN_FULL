package com.example.backend.repository.imp;

import com.example.backend.entities.CraftingTechnique;
import com.example.backend.repository.irepo.ICraftingTechniqueService;
import com.example.backend.repository.repo.CraftingTechniqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CraftingTechniqueServiceImp implements ICraftingTechniqueService {
    @Autowired
    private CraftingTechniqueRepository craftingTechniqueRepository;

    @Override
    public Iterable<CraftingTechnique> findAll() {
        return craftingTechniqueRepository.findAll();
    }

    @Override
    public Optional<CraftingTechnique> findById(Integer id) {
        return craftingTechniqueRepository.findById(id);
    }

    @Override
    public CraftingTechnique save(CraftingTechnique craftingTechnique) {
        return craftingTechniqueRepository.save(craftingTechnique);
    }

    @Override
    public void remove(Integer id) {
        craftingTechniqueRepository.deleteById(id);
    }
}
