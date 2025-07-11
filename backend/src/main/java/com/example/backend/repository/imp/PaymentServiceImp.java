package com.example.backend.repository.imp;

import com.example.backend.dto.PaymentDTO;
import com.example.backend.entities.Order;
import com.example.backend.entities.Payment;
import com.example.backend.repository.irepo.IPaymentService;
import com.example.backend.repository.repo.OrderRepository;
import com.example.backend.repository.repo.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImp{
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Order order = orderRepository.findById(paymentDTO.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + paymentDTO.getOrderId()));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(new BigDecimal(String.valueOf(paymentDTO.getAmount())));
        payment.setPaymentStatus(Payment.PaymentStatus.valueOf(paymentDTO.getPaymentStatus()));
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());

        paymentRepository.save(payment);

        paymentDTO.setPaymentId(payment.getPaymentId());
        paymentDTO.setPaymentDate(payment.getPaymentDate());
        return paymentDTO;
    }

    @Transactional
    public PaymentDTO updatePayment(Integer id, PaymentDTO paymentDTO) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with ID: " + id));
        Order order = orderRepository.findById(paymentDTO.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + paymentDTO.getOrderId()));

        payment.setOrder(order);
        payment.setAmount(new BigDecimal(String.valueOf(paymentDTO.getAmount())));
        payment.setPaymentStatus(Payment.PaymentStatus.valueOf(paymentDTO.getPaymentStatus()));
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setPaymentTransactionId(paymentDTO.getPaymentTransactionId());
        payment.setPaymentDate(LocalDateTime.now());

        paymentRepository.save(payment);

        paymentDTO.setPaymentId(payment.getPaymentId());
        paymentDTO.setPaymentDate(payment.getPaymentDate());
        return paymentDTO;
    }

    @Transactional
    public void deletePayment(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with ID: " + id));
        payment.setActive(false);
        paymentRepository.save(payment);
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findByIsActiveTrue().stream().map(payment -> {
            PaymentDTO dto = new PaymentDTO();
            dto.setPaymentId(payment.getPaymentId());
            dto.setOrderId(payment.getOrder().getOrderId());
            dto.setAmount(payment.getAmount());
            dto.setPaymentStatus(payment.getPaymentStatus().toString());
            dto.setPaymentMethod(payment.getPaymentMethod());
            dto.setPaymentTransactionId(payment.getPaymentTransactionId());
            dto.setPaymentDate(payment.getPaymentDate());
            return dto;
        }).collect(Collectors.toList());
    }

    public Optional<PaymentDTO> findById(Integer id) {
        return paymentRepository.findById(id).map(payment -> {
            PaymentDTO dto = new PaymentDTO();
            dto.setPaymentId(payment.getPaymentId());
            dto.setOrderId(payment.getOrder().getOrderId());
            dto.setAmount(new BigDecimal(String.valueOf(payment.getAmount())));
            dto.setPaymentStatus(payment.getPaymentStatus().toString());
            dto.setPaymentMethod(payment.getPaymentMethod());
            dto.setPaymentTransactionId(payment.getPaymentTransactionId());
            dto.setPaymentDate(payment.getPaymentDate());
            return dto;
        });
    }

    public PaymentDTO findByOrderId(Integer orderId) {
        Payment payment = paymentRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for order ID: " + orderId));
        PaymentDTO dto = new PaymentDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setOrderId(payment.getOrder().getOrderId());
        dto.setAmount(new BigDecimal(String.valueOf(payment.getAmount())));
        dto.setPaymentStatus(payment.getPaymentStatus().toString());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentTransactionId(payment.getPaymentTransactionId());
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }
}
