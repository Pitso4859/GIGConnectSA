package com.gigconnect.dto.request;

import com.gigconnect.entity.User;
import jakarta.validation.constraints.*;

// ─── Auth Requests ────────────────────────────────────────────────────────

public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 150) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotNull User.Role role,
        String phone
) {}

// ─────────────────────────────────────────────────────────────────────────

package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;

public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {}

// ─────────────────────────────────────────────────────────────────────────

package com.gigconnect.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(@NotBlank String refreshToken) {}

// ─────────────────────────────────────────────────────────────────────────

package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record CreateJobRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank String description,
        String category,
        List<String> requiredSkills,
        @NotBlank String location,
        BigDecimal latitude,
        BigDecimal longitude,
        @NotNull @DecimalMin("10.00") BigDecimal budget
) {}

// ─────────────────────────────────────────────────────────────────────────

package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;

public record RatingRequest(
        @NotNull @Min(1) @Max(5) Integer score,
        @Size(max = 1000) String comment
) {}

// ─────────────────────────────────────────────────────────────────────────

package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;

public record AiChatRequest(@NotBlank @Size(max = 2000) String message) {}

// ─────────────────────────────────────────────────────────────────────────

package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record WalletDepositRequest(
        @NotNull @DecimalMin("10.00") BigDecimal amount
) {}
