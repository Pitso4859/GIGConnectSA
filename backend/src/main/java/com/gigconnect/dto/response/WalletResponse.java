package com.gigconnect.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data @Builder
public class WalletResponse {
    private UUID id;
    private BigDecimal balance;
    private Instant updatedAt;
    private List<TransactionResponse> transactions;

    @Data @Builder
    public static class TransactionResponse {
        private UUID id;
        private String type;
        private BigDecimal amount;
        private String description;
        private Instant createdAt;
    }
}
