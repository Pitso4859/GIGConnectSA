package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.UUID;

@Data
public class RatingRequest {
    @NotNull
    private UUID jobId;

    @NotNull @Min(1) @Max(5)
    private Integer score;

    @Size(max = 500)
    private String comment;
}
