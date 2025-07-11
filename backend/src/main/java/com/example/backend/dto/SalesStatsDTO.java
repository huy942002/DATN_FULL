package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for monthly sales statistics, including order count, distinct customer count,
 * total revenue before discount, total discount applied, and net revenue.
 */
public class SalesStatsDTO {
    private String period;
    private long totalOrders;
    private long totalCustomers;
    private BigDecimal totalRevenue;
    private BigDecimal totalDiscount;
    private BigDecimal netRevenue;

    public SalesStatsDTO(String period,
                         long totalOrders,
                         long totalCustomers,
                         BigDecimal totalRevenue,
                         BigDecimal totalDiscount) {
        this.period = period;
        this.totalOrders = totalOrders;
        this.totalCustomers = totalCustomers;
        this.totalRevenue = totalRevenue;
        this.totalDiscount = totalDiscount;
        this.netRevenue = totalRevenue.subtract(totalDiscount);
    }

    // Getters
    public String getPeriod() { return period; }
    public long getTotalOrders() { return totalOrders; }
    public long getTotalCustomers() { return totalCustomers; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public BigDecimal getTotalDiscount() { return totalDiscount; }
    public BigDecimal getNetRevenue() { return netRevenue; }
}