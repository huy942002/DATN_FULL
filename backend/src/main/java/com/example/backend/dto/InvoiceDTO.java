package com.example.backend.dto;

import com.example.backend.entities.Invoice;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InvoiceDTO {
    private Integer invoiceId;

    private Integer orderId;

    private Long customerId;

    private Long employeeId;

    @Min(value = 0, message = "Total amount must be non-negative")
    private BigDecimal totalAmount;

    @Min(value = 0, message = "Tax amount must be non-negative")
    private BigDecimal taxAmount;

    @Min(value = 0, message = "Final amount must be non-negative")
    private BigDecimal finalAmount;

    private LocalDateTime invoiceDate;

    @NotNull(message = "Invoice status is required")
    private Invoice.InvoiceStatus invoiceStatus;

    @Size(max = 50, message = "Payment method must not exceed 50 characters")
    private String paymentMethod;

    // Getters and setters
    public Integer getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Integer invoiceId) { this.invoiceId = invoiceId; }
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
    public LocalDateTime getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDateTime invoiceDate) { this.invoiceDate = invoiceDate; }
    public Invoice.InvoiceStatus getInvoiceStatus() { return invoiceStatus; }
    public void setInvoiceStatus(Invoice.InvoiceStatus invoiceStatus) { this.invoiceStatus = invoiceStatus; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}