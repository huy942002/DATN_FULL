package com.example.backend.repository.repo;

import com.example.backend.entities.Employee;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Iterable<Employee> findByStatus(int status);

    List<Employee> findByIsActiveTrue();
    Optional<Employee> findByUserAndIsActiveTrue(User user);
    Optional<Employee> findByEmailAndIsActiveTrue(String email);
}
