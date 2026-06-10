package com.gigconnect.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data @Builder
public class AiChatResponse {
    private String role;
    private String content;
    private Instant createdAt;
}
