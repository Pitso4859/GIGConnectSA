package com.gigconnect.dto.response;

import com.gigconnect.entity.User;
import java.util.UUID;

/**
 * Lightweight user projection used inside AuthResponse and JobResponse.
 * Field names match the frontend TypeScript User interface.
 */
public record UserSummary(
        UUID id,
        String fullName,
        String email,
        String role,
        String avatarUrl,
        boolean isVerified
) {
    public static UserSummary from(User u) {
        return new UserSummary(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getRole().name(),
                u.getAvatarUrl(),
                u.isVerified()
        );
    }
}
