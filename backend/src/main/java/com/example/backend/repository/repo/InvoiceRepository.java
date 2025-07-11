package com.example.backend.repository.repo;

import com.example.backend.entities.Invoice;
import com.example.backend.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Integer> {
    List<Invoice> findByOrderAndIsActiveTrue(Order order);
    List<Invoice> findByIsActiveTrue();
    List<Invoice> findByInvoiceStatusAndIsActiveTrue(String invoiceStatus);

    Optional<Invoice> findByOrder_OrderId(Integer orderId);
}
