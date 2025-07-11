package com.example.backend.RestController;

import com.example.backend.dto.SalesStatsDTO;
import com.example.backend.enums.Granularity;
import com.example.backend.repository.imp.StatisticsServiceImpl;
import com.example.backend.repository.irepo.IStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
public class StatisticsController {
    @Autowired
    private StatisticsServiceImpl statsService;


    /**
     * API: Doanh thu theo tháng (group 1)
     */
    @GetMapping("/api/stats/revenue")
    public List<SalesStatsDTO> getRevenue(
            @RequestParam(name = "startDate") String startDate,
            @RequestParam(name = "endDate") String endDate,
            @RequestParam(name = "granularity", defaultValue = "DAILY") Granularity granularity) {
        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
        LocalDateTime end   = LocalDate.parse(endDate).atTime(LocalTime.MAX);
        return statsService.getRevenueByDateRange(start, end, granularity);
    }

    // ... các endpoint nhóm 2,3
}
