package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;
import java.util.UUID;

public record RatingRequest(
        @NotNull UUID jobId,
        @NotNull @Min(1) @Max(5) Integer score,
        @Size(max = 1000) String comment
) {}