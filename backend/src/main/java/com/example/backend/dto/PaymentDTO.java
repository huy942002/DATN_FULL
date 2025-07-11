package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTO {
    private Integer paymentId;

    private Integer orderId;

    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount must be non-negative")
    private BigDecimal amount;

    @NotNull(message = "Payment status is required")
    private String paymentStatus;

    @Size(max = 50, message = "Payment method must not exceed 50 characters")
    private String paymentMethod;

    @Size(max = 100, message = "Transaction ID must not exceed 100 characters")
    private String paymentTransactionId;

    private LocalDateTime paymentDate;

    @Size(max = 20, message = "Mobile must not exceed 20 characters")
    private String billMobile;

    @Size(max = 50, message = "Email must not exceed 50 characters")
    private String billEmail;

    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String billFirstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String billLastName;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String billAddress;

    @Size(max = 50, message = "City must not exceed 50 characters")
    private String billCity;

    @Size(max = 50, message = "Country must not exceed 50 characters")
    private String billCountry;

    private String returnUrl; // New field for dynamic return URL

    // Getters and setters


    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getPaymentId() { return paymentId; }
    public void setPaymentId(Integer paymentId) { this.paymentId = paymentId; }
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentTransactionId() { return paymentTransactionId; }
    public void setPaymentTransactionId(String paymentTransactionId) { this.paymentTransactionId = paymentTransactionId; }
    public LocalDateTime getPaymentDate() { return paymentDate; }

    public String getReturnUrl() {
        return returnUrl;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    public String getBillMobile() { return billMobile; }
    public void setBillMobile(String billMobile) { this.billMobile = billMobile; }
    public String getBillEmail() { return billEmail; }
    public void setBillEmail(String billEmail) { this.billEmail = billEmail; }
    public String getBillFirstName() { return billFirstName; }
    public void setBillFirstName(String billFirstName) { this.billFirstName = billFirstName; }
    public String getBillLastName() { return billLastName; }
    public void setBillLastName(String billLastName) { this.billLastName = billLastName; }
    public String getBillAddress() { return billAddress; }
    public void setBillAddress(String billAddress) { this.billAddress = billAddress; }
    public String getBillCity() { return billCity; }
    public void setBillCity(String billCity) { this.billCity = billCity; }
    public String getBillCountry() { return billCountry; }
    public void setBillCountry(String billCountry) { this.billCountry = billCountry; }
}