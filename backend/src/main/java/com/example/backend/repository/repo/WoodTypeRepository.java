package com.example.backend.repository.repo;

import com.example.backend.entities.WoodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WoodTypeRepository extends JpaRepository<WoodType, Integer> {
    List<WoodType> findByIsActiveTrue();
    Optional<WoodType> findByWoodTypeNameAndIsActiveTrue(String woodTypeName);
}
