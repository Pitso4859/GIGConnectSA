package com.gigconnect.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data @Builder
public class LeaderboardEntry {
    private int rank;
    private UUID userId;
    private String fullName;
    private String avatarUrl;
    private double averageRating;
    private long totalRatings;
    private long totalJobsCompleted;
    private String badge;
}
