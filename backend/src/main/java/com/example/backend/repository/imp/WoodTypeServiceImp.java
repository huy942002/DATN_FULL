package com.example.backend.repository.imp;

import com.example.backend.entities.WoodType;
import com.example.backend.repository.irepo.IWoodTypeService;
import com.example.backend.repository.repo.WoodTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Optional;

@Service
public class WoodTypeServiceImp implements IWoodTypeService {
    @Autowired
    private WoodTypeRepository woodTypeRepository;

    @Value("${image.upload.dir:src/main/resources/static/images}")
    private String uploadDir;

    @Override
    public Iterable<WoodType> findAll() {
        return woodTypeRepository.findAll();
    }

    @Override
    public Optional<WoodType> findById(Integer id) {
        Optional<WoodType> woodType = woodTypeRepository.findById(id);
        if (woodType.isPresent()) {
            WoodType wt = woodType.get();
            String imageUrl = wt.getNaturalImageUrl();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                File imageFile = new File(uploadDir + "/" + imageUrl);
                if (!imageFile.exists()) {
                    wt.setNaturalImageUrl(null); // Trả về null nếu ảnh không tồn tại
                }
            }
        }
        return woodType;
    }

    @Override
    public WoodType save(WoodType woodType) {
        Optional<WoodType> existing = woodTypeRepository.findByWoodTypeNameAndIsActiveTrue(woodType.getWoodTypeName());
        if (existing.isPresent() && !existing.get().getWoodTypeId().equals(woodType.getWoodTypeId())) {
            throw new IllegalArgumentException("Wood type name already exists");
        }
        System.out.println(woodType.toString()+"///imp");
        return woodTypeRepository.save(woodType);
    }

    @Override
    public void remove(Integer id) {
        woodTypeRepository.findById(id).ifPresent(woodType -> {
            woodType.setActive(false);
            woodTypeRepository.save(woodType);
        });
    }
}