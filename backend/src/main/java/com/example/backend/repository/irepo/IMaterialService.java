package com.example.backend.repository.irepo;

import com.example.backend.entities.Material;
import org.springframework.stereotype.Service;

@Service
public interface IMaterialService extends IGeneralService<Material>{
    public Material updateMaterial(Material material);
}
