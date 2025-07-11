package com.example.backend.repository.repo;

import com.example.backend.entities.User;
import com.example.backend.entities.UserLoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UserLoginHistoryRepository extends JpaRepository<UserLoginHistory, Long> {
    List<UserLoginHistory> findByUserAndTimeLoginBetween(User user, LocalDateTime start, LocalDateTime end);
    List<UserLoginHistory> findByUserAndTimeLogoutIsNull(User user);
}