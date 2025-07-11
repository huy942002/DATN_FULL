package com.example.backend.repository.repo;

import com.example.backend.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material,Integer> {
    List<Material> findByIsActiveTrue();
    Optional<Material> findByMaterialNameAndIsActiveTrue(String materialName);
}
