package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;

public record RatingRequest(
        @NotNull @Min(1) @Max(5) Integer score,
        @Size(max = 1000) String comment
) {}