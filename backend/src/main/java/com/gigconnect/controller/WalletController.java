package com.gigconnect.controller;

import com.gigconnect.dto.response.ApiResponse;
import com.gigconnect.dto.response.WalletResponse;
import com.gigconnect.security.SecurityUtils;
import com.gigconnect.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ApiResponse<WalletResponse> getWallet() {
        return ApiResponse.ok(walletService.getWallet(SecurityUtils.getCurrentUserId()));
    }
}
