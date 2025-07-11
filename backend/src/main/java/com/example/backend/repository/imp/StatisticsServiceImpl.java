package com.example.backend.repository.imp;



import com.example.backend.dto.SalesStatsDTO;
import com.example.backend.enums.Granularity;
import com.example.backend.repository.irepo.IStatisticsService;
import com.example.backend.repository.repo.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticsServiceImpl implements IStatisticsService {

    @Autowired
    private PaymentRepository paymentRepo;

    @Override
    public List<SalesStatsDTO> getRevenueByDateRange(LocalDateTime start, LocalDateTime end, Granularity granularity) {
        List<Object[]> raw;
        switch (granularity) {
            case WEEKLY: raw = paymentRepo.weeklyRevenueRaw(start, end); break;
            case MONTHLY: raw = paymentRepo.monthlyRevenueRaw(start, end); break;
            case YEARLY: raw = paymentRepo.yearlyRevenueRaw(start, end); break;
            case DAILY: default: raw = paymentRepo.dailyRevenueRaw(start, end);
        }
        return raw.stream()
                .map(r -> new SalesStatsDTO(
                        (String) r[0],
                        ((Number) r[1]).longValue(),
                        ((Number) r[2]).longValue(),
                        (BigDecimal) r[3],
                        BigDecimal.ZERO
                ))
                .collect(Collectors.toList());
    }

    // ... các method nhóm 2,3
}
