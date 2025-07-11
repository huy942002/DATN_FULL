package com.example.backend.repository.repo;

import com.example.backend.entities.Order;
import com.example.backend.entities.OrderDetail;
import com.example.backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Integer> {
    List<OrderDetail> findByOrderOrderIdAndIsActiveTrue(Integer orderId);
    List<OrderDetail> findByOrderAndIsActiveTrue(Order order);
    List<OrderDetail> findByIsActiveTrue();
}
