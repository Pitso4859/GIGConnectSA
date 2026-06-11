
package com.gigconnect.dto.request;

import jakarta.validation.constraints.*;
        import java.math.BigDecimal;

public record WalletDepositRequest(
        @NotNull @DecimalMin("10.00") BigDecimal amount
) {}