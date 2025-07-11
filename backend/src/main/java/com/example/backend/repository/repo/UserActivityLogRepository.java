package com.example.backend.repository.repo;
import com.example.backend.entities.User;
import com.example.backend.entities.UserActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {
    List<UserActivityLog> findByUserAndTimestampBetween(User user, LocalDateTime start, LocalDateTime end);
    List<UserActivityLog> findByActionType(String actionType);
}
