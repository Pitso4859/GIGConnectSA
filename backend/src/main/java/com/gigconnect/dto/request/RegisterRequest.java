package com.gigconnect.dto.request;

import com.gigconnect.entity.User;
import jakarta.validation.constraints.*;

/**
 * Registration request DTO.
 * Migrated from Lombok @Data class to Java record for consistency with Requests.java.
 * Note: the canonical record version in Requests.java takes precedence; this file
 * is kept as the single authoritative source.
 */
public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 150) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotNull User.Role role,
        String phone,
        String location
) {}
