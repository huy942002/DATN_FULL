package com.example.backend.RestController;

import com.example.backend.dto.ReqRes;
import com.example.backend.entities.User;
import com.example.backend.repository.repo.UserRepository;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/signup")
    public ResponseEntity<ReqRes> signup(@RequestBody ReqRes registrationRequest, HttpServletResponse response) {
        ReqRes result = authService.signUp(registrationRequest);
        if (result.getStatusCode() == 200) {
            // Generate token
            String jwt = authService.getJwtUtils().generateToken(result.getOurUsers());
            // Set cookie
            Cookie cookie = new Cookie("token", jwt);
            cookie.setHttpOnly(true);
            // cookie.setSecure(true); // Uncomment for production (HTTPS)
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 24 hours
            cookie.setAttribute("SameSite", "Strict");
            response.addCookie(cookie);
        }
        return ResponseEntity.status(result.getStatusCode()).body(result);
    }

    @PostMapping("/signin")
    public ResponseEntity<ReqRes> signin(@RequestBody ReqRes signinRequest, HttpServletResponse response) {
        ReqRes result = authService.signIn(signinRequest);
        if (result.getStatusCode() == 200) {
            User user = userRepo.findByUsername(signinRequest.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            // Generate tokens
            String jwt = authService.getJwtUtils().generateToken(user);
            String refreshToken = authService.getJwtUtils().generateRefreshToken(new HashMap<>(), user);
            // Set cookie
            Cookie cookie = new Cookie("token", jwt);
            cookie.setHttpOnly(true);
            // cookie.setSecure(true); // Uncomment for production (HTTPS)
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 24 hours
            cookie.setAttribute("SameSite", "Strict");
            response.addCookie(cookie);
            // Include tokens in response for compatibility
            result.setToken(jwt);
            result.setRefreshToken(refreshToken);
        }
        return ResponseEntity.status(result.getStatusCode()).body(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes refreshTokenRequest, HttpServletResponse response) {
        ReqRes result = authService.refreshToken(refreshTokenRequest);
        if (result.getStatusCode() == 200) {
            // Set new token in cookie
            Cookie cookie = new Cookie("token", result.getToken());
            cookie.setHttpOnly(true);
            // cookie.setSecure(true); // Uncomment for production (HTTPS)
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 24 hours
            cookie.setAttribute("SameSite", "Strict");
            response.addCookie(cookie);
        }
        return ResponseEntity.status(result.getStatusCode()).body(result);
    }
}