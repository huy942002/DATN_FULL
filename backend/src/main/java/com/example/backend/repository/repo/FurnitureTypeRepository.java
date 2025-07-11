package com.example.backend.repository.repo;

import com.example.backend.entities.FurnitureType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FurnitureTypeRepository extends JpaRepository<FurnitureType, Integer> {
    List<FurnitureType> findByIsActiveTrue();
    Optional<FurnitureType> findByTypeNameAndIsActiveTrue(String typeName);
}
