package com.example.backend.entities;

import jakarta.persistence.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "UserLoginHistory")
@EntityListeners(AuditingEntityListener.class)
public class UserLoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime timeLogin;

    @Column(nullable = true)
    private LocalDateTime timeLogout;

    @Column(columnDefinition = "NVARCHAR(45)", nullable = true)
    private String ipAddress;

    @Column(columnDefinition = "NVARCHAR(255)", nullable = true)
    private String deviceInfo;

    @Column(name = "active", nullable = false)
    private boolean isActive = true;

    public UserLoginHistory() {}

    @PrePersist
    protected void onCreate() {
        if (timeLogin == null) {
            timeLogin = LocalDateTime.now();
        }
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

    public LocalDateTime getTimeLogin() {
        return timeLogin;
    }

    public void setTimeLogin(LocalDateTime timeLogin) {
        this.timeLogin = timeLogin;
    }

    public LocalDateTime getTimeLogout() {
        return timeLogout;
    }

    public void setTimeLogout(LocalDateTime timeLogout) {
        this.timeLogout = timeLogout;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        this.isActive = active;
    }

    // Note: Consider adding indexes for performance
    // CREATE INDEX idx_user_id ON UserLoginHistory(user_id);
    // CREATE INDEX idx_time_login ON UserLoginHistory(time_login);
}