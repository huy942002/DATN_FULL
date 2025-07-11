package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Invoices")
@EntityListeners(AuditingEntityListener.class)
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer invoiceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(nullable = false)
    @Min(value = 0, message = "Total amount must be non-negative")
    private BigDecimal totalAmount;

    @Column(nullable = false)
    @Min(value = 0, message = "Tax amount must be non-negative")
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    @Min(value = 0, message = "Final amount must be non-negative")
    private BigDecimal finalAmount;

    @Column(nullable = false)
    private LocalDateTime invoiceDate;

    @Column(columnDefinition = "NVARCHAR(50)", nullable = false)
    @Enumerated(EnumType.STRING)
    private InvoiceStatus invoiceStatus = InvoiceStatus.PENDING;

    @Column(columnDefinition = "NVARCHAR(50)", nullable = true)
    private String paymentMethod;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "active", nullable = false)
    private boolean isActive = true;

    public enum InvoiceStatus {
        PENDING, PAID, CANCELLED,FAILED
    }

    public Invoice() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        invoiceDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        invoiceDate = LocalDateTime.now();
    }

    public Integer getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Integer invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(BigDecimal finalAmount) {
        this.finalAmount = finalAmount;
    }

    public LocalDateTime getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDateTime invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public InvoiceStatus getInvoiceStatus() {
        return invoiceStatus;
    }

    public void setInvoiceStatus(InvoiceStatus invoiceStatus) {
        this.invoiceStatus = invoiceStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    // Note: Consider adding index on order_id
    // CREATE INDEX idx_order_id ON Invoices(order_id);
}