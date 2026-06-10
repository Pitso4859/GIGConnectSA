package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class JobRequest {
    @NotBlank @Size(min = 5, max = 200)
    private String title;

    @NotBlank @Size(min = 20)
    private String description;

    @NotBlank
    private String category;

    @NotBlank
    private String location;

    private Double latitude;
    private Double longitude;

    @NotNull @DecimalMin("10.00")
    private BigDecimal budget;

    private String requiredSkills;
}
