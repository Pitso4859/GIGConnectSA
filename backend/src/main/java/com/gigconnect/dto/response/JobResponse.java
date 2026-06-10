package com.gigconnect.dto.response;

import com.gigconnect.entity.Job;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data @Builder
public class JobResponse {
    private UUID id;
    private UserResponse client;
    private UserResponse worker;
    private String title;
    private String description;
    private String category;
    private String location;
    private Double latitude;
    private Double longitude;
    private BigDecimal budget;
    private Job.Status status;
    private String requiredSkills;
    private String proofImageUrl;
    private Instant postedAt;
    private Instant acceptedAt;
    private Instant completedAt;
}
