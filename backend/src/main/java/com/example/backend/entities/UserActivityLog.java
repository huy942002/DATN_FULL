package com.example.backend.entities;

import jakarta.persistence.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "UserActivityLog")
@EntityListeners(AuditingEntityListener.class)
public class UserActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "NVARCHAR(50)", nullable = false)
    private String actionType;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = true)
    private String details;

    @Column(columnDefinition = "NVARCHAR(45)", nullable = true)
    private String ipAddress;

    @Column(name = "active", nullable = false)
    private boolean isActive = true;

    public UserActivityLog() {}

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        this.isActive = active;
    }

    // Note: Consider adding indexes for performance
    // CREATE INDEX idx_user_id ON UserActivityLog(user_id);
    // CREATE INDEX idx_timestamp ON UserActivityLog(timestamp);
}