package com.gigconnect.controller;

import com.gigconnect.dto.request.ProfileUpdateRequest;
import com.gigconnect.dto.response.ApiResponse;
import com.gigconnect.dto.response.UserResponse;
import com.gigconnect.security.SecurityUtils;
import com.gigconnect.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getProfile() {
        return ApiResponse.ok(userService.getProfile(SecurityUtils.getCurrentUserId()));
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.ok("Profile updated",
                userService.updateProfile(SecurityUtils.getCurrentUserId(), request));
    }

    @GetMapping("/workers")
    public ApiResponse<List<UserResponse>> searchWorkers(
            @RequestParam(required = false) String search) {
        return ApiResponse.ok(userService.searchWorkers(search));
    }
}
