package com.gigconnect.dto.response;

import com.gigconnect.entity.UserRole;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data @Builder
public class UserProfileResponse {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private UserRole role;
    private String avatarUrl;
    private String bio;
    private String location;
    private boolean verified;
    private BigDecimal walletBalance;
    private BigDecimal reputationScore;
    private int totalRatings;
    private int completedJobs;
    private List<SkillDto> skills;
    private Instant createdAt;

    @Data @Builder public static class SkillDto {
        private UUID id; private String skillName; private int experienceYears;
    }
}
