package com.example.backend.repository.repo;

import com.example.backend.entities.Customer;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByIsActiveTrue();
    Optional<Customer> findByUserAndIsActiveTrue(User user);
    Optional<Customer> findByEmailAndIsActiveTrue(String email);

    @Query("SELECT c FROM Customer c JOIN c.user u WHERE u.username = :username")
    Optional<Customer> findByUsername(@Param("username") String username);

    @Query("SELECT c FROM Customer c WHERE c.id IN :ids AND c.isActive = true")
    List<Customer> findByIdsAndIsActiveTrue(@Param("ids") List<Long> ids);
}
