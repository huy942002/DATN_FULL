package com.example.backend.repository.repo;
import com.example.backend.entities.Style;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface StyleRepository extends JpaRepository<Style, Integer> {
    List<Style> findByIsActiveTrue();
    Optional<Style> findByStyleNameAndIsActiveTrue(String styleName);
}
