package com.gigconnect.dto.response;

import com.gigconnect.entity.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

// ─── Auth ────────────────────────────────────────────────────────────────
public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserSummary user
) {}

// ─── User ────────────────────────────────────────────────────────────────
public record UserSummary(
        UUID id,
        String fullName,
        String email,
        String role,
        String avatarUrl,
        boolean verified
) {
    public static UserSummary from(User u) {
        return new UserSummary(u.getId(), u.getFullName(), u.getEmail(),
                u.getRole().name(), u.getAvatarUrl(), u.isVerified());
    }
}

// ─── Job ─────────────────────────────────────────────────────────────────
public record JobResponse(
        UUID id,
        String title,
        String description,
        String category,
        List<String> requiredSkills,
        String location,
        BigDecimal budget,
        String status,
        UserSummary client,
        UserSummary worker,
        String proofImageUrl,
        BigDecimal aiMatchScore,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}

// ─── Worker ──────────────────────────────────────────────────────────────
public record WorkerResponse(
        UUID id,
        String fullName,
        String avatarUrl,
        String bio,
        String location,
        List<String> skills,
        String category,
        BigDecimal hourlyRate,
        Integer experienceYrs,
        BigDecimal avgRating,
        Integer totalJobs,
        BigDecimal completionRate,
        boolean verified
) {}

// ─── Wallet ──────────────────────────────────────────────────────────────
public record WalletResponse(
        UUID id,
        BigDecimal balance,
        BigDecimal escrow,
        List<TransactionResponse> recentTransactions
) {}

public record TransactionResponse(
        UUID id,
        String type,
        BigDecimal amount,
        BigDecimal balanceAfter,
        String description,
        OffsetDateTime createdAt
) {}

// ─── AI ──────────────────────────────────────────────────────────────────
public record AiChatResponse(
        String reply,
        String conversationId
) {}

// ─── Leaderboard ─────────────────────────────────────────────────────────
public record LeaderboardEntry(
        int rank,
        UUID workerId,
        String fullName,
        String avatarUrl,
        Integer totalJobs,
        BigDecimal avgRating,
        BigDecimal completionRate
) {}

// ─── Generic ────────────────────────────────────────────────────────────
public record MessageResponse(String message) {}

public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {}
