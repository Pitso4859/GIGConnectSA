package com.gigconnect.dto.response;

import com.gigconnect.entity.User;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data @Builder
public class UserResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private User.Role role;
    private String avatarUrl;
    private String bio;
    private String location;
    private boolean isVerified;
    private Instant createdAt;
    private Double averageRating;
    private long totalJobsCompleted;
}
