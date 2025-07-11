package com.example.backend.dto;

import com.example.backend.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String username;
    private List<String> role;
    private String password;
    private int status;
    private User ourUsers;
    private Map<String, Object> userData; // Added to store Customer data

    public int getStatusCode() {
        return statusCode;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getExpirationTime() {
        return expirationTime;
    }

    public String getUsername() {
        return username;
    }

    public List<String> getRole() {
        return role;
    }

    public String getPassword() {
        return password;
    }

    public int getStatus() {
        return status;
    }

    public User getOurUsers() {
        return ourUsers;
    }

    public Map<String, Object> getUserData() {
        return userData;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public void setError(String error) {
        this.error = error;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setExpirationTime(String expirationTime) {
        this.expirationTime = expirationTime;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(List<String> role) {
        this.role = role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setOurUsers(User ourUsers) {
        this.ourUsers = ourUsers;
    }

    public void setUserData(Map<String, Object> userData) {
        this.userData = userData;
    }
}