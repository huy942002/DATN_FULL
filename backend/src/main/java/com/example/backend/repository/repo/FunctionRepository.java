package com.example.backend.repository.repo;

import com.example.backend.entities.Functions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FunctionRepository extends JpaRepository<Functions, Integer> {
    List<Functions> findByIsActiveTrue();
    Optional<Functions> findByFunctionNameAndIsActiveTrue(String functionName);
}
