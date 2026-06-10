package com.gigconnect.controller;

import com.gigconnect.dto.request.AiChatRequest;
import com.gigconnect.dto.response.AiChatResponse;
import com.gigconnect.dto.response.ApiResponse;
import com.gigconnect.security.SecurityUtils;
import com.gigconnect.service.ai.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiChatController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ApiResponse<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        return ApiResponse.ok(geminiService.chat(SecurityUtils.getCurrentUserId(), request));
    }

    @GetMapping("/history")
    public ApiResponse<List<AiChatResponse>> getHistory() {
        return ApiResponse.ok(geminiService.getChatHistory(SecurityUtils.getCurrentUserId()));
    }

    @DeleteMapping("/history")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearHistory() {
        geminiService.clearHistory(SecurityUtils.getCurrentUserId());
    }
}
