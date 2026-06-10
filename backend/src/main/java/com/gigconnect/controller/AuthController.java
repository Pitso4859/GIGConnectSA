package com.gigconnect.controller;

import com.gigconnect.dto.request.LoginRequest;
import com.gigconnect.dto.request.RegisterRequest;
import com.gigconnect.dto.response.ApiResponse;
import com.gigconnect.dto.response.AuthResponse;
import com.gigconnect.security.SecurityUtils;
import com.gigconnect.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok("Registration successful", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("Login successful", authService.login(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@RequestParam String token) {
        return ApiResponse.ok("Token refreshed", authService.refreshToken(token));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        authService.logout(SecurityUtils.getCurrentUserId());
        return ApiResponse.ok("Logged out successfully");
    }
}
