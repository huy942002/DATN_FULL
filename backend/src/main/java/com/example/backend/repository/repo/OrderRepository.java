package com.example.backend.repository.repo;

import com.example.backend.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findByIsActiveTrue();
    List<Order> findByStatusAndIsActiveTrue(String status);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.isActive = true")
    List<Order> findByStatusAndIsActiveTrue(@Param("status") Order.OrderStatus status);


}
