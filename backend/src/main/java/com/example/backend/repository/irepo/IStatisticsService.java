package com.example.backend.repository.irepo;

import com.example.backend.dto.SalesStatsDTO;
import com.example.backend.enums.Granularity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface IStatisticsService {
    List<SalesStatsDTO> getRevenueByDateRange(LocalDateTime start, LocalDateTime end, Granularity granularity);
}
