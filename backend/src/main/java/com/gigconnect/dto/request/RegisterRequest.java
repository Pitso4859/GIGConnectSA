package com.gigconnect.dto.request;

import com.gigconnect.entity.User;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 150) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotNull User.Role role,
        String phone,
        String location
) {}