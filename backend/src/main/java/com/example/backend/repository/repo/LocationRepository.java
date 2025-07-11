package com.example.backend.repository.repo;

import com.example.backend.entities.Locations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Locations, Integer> {

    Optional<Locations> findByLocationNameAndIsActiveTrue(String locationName);
}
