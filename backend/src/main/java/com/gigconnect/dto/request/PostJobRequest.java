package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class PostJobRequest {
    @NotBlank @Size(min = 5, max = 200)
    private String title;
    @NotBlank @Size(min = 10)
    private String description;
    @NotBlank
    private String location;
    @NotNull @Positive
    private BigDecimal budget;
    private UUID categoryId;
    private List<String> requiredSkills;
    private String estimatedDuration;
}
