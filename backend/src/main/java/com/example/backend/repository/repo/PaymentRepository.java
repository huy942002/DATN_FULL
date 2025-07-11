package com.example.backend.repository.repo;

import com.example.backend.dto.SalesStatsDTO;
import com.example.backend.entities.Order;
import com.example.backend.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Integer> {
    List<Payment> findByOrderAndIsActiveTrue(Order order);
    List<Payment> findByIsActiveTrue();
    List<Payment> findByPaymentStatusAndIsActiveTrue(String paymentStatus);

    Optional<Payment> findByOrder_OrderId(Integer orderId);
    @Query(value =
            "SELECT CONVERT(varchar(10), CAST(p.payment_date AS date), 23) AS period, " +
                    "COUNT(DISTINCT p.order_id), COUNT(DISTINCT o.customer_id), SUM(p.amount) " +
                    "FROM payments p JOIN orders o ON p.order_id = o.order_id " +
                    "WHERE p.payment_status='COMPLETED' AND p.payment_date BETWEEN :start AND :end " +
                    "GROUP BY CAST(p.payment_date AS date) " +
                    "ORDER BY CAST(p.payment_date AS date)",
            nativeQuery = true)
    List<Object[]> dailyRevenueRaw(@Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);

    // Weekly: YYYY-Www
    @Query(value =
            "SELECT CONCAT(CAST(YEAR(p.payment_date) AS varchar), '-W', RIGHT('00'+CAST(DATEPART(iso_week,p.payment_date) AS varchar),2)) AS period, " +
                    "COUNT(DISTINCT p.order_id), COUNT(DISTINCT o.customer_id), SUM(p.amount) " +
                    "FROM payments p JOIN orders o ON o.order_id=p.order_id " +
                    "WHERE p.payment_status='COMPLETED' AND p.payment_date BETWEEN :start AND :end " +
                    "GROUP BY YEAR(p.payment_date), DATEPART(iso_week,p.payment_date) " +
                    "ORDER BY YEAR(p.payment_date), DATEPART(iso_week,p.payment_date)",
            nativeQuery = true)
    List<Object[]> weeklyRevenueRaw(@Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);

    // Monthly: yyyy-MM
    @Query(value =
            "SELECT CONVERT(varchar(7), p.payment_date, 23) AS period, " +
                    "COUNT(DISTINCT p.order_id), COUNT(DISTINCT o.customer_id), SUM(p.amount) " +
                    "FROM payments p JOIN orders o ON o.order_id=p.order_id " +
                    "WHERE p.payment_status='COMPLETED' AND p.payment_date BETWEEN :start AND :end " +
                    "GROUP BY CONVERT(varchar(7), p.payment_date, 23) " +
                    "ORDER BY CONVERT(varchar(7), p.payment_date, 23)",
            nativeQuery = true)
    List<Object[]> monthlyRevenueRaw(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);

    // Yearly: yyyy
    @Query(value =
            "SELECT CAST(YEAR(p.payment_date) AS varchar) AS period, " +
                    "COUNT(DISTINCT p.order_id), COUNT(DISTINCT o.customer_id), SUM(p.amount) " +
                    "FROM payments p JOIN orders o ON o.order_id=p.order_id " +
                    "WHERE p.payment_status='COMPLETED' AND p.payment_date BETWEEN :start AND :end " +
                    "GROUP BY YEAR(p.payment_date) " +
                    "ORDER BY YEAR(p.payment_date)",
            nativeQuery = true)
    List<Object[]> yearlyRevenueRaw(@Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);
}
