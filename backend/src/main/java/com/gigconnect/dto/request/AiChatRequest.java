package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;

public record AiChatRequest(@NotBlank @Size(max = 2000) String message) {}