package com.gigconnect.dto.response;

/**
 * Authentication response returned on register/login/refresh.
 * Uses a Java record so callers must use the canonical constructor:
 *   new AuthResponse(accessToken, refreshToken, user)
 * — NOT .builder().build()
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserSummary user
) {}
