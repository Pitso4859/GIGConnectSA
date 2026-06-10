package com.gigconnect.controller;

import com.gigconnect.dto.request.RatingRequest;
import com.gigconnect.dto.response.ApiResponse;
import com.gigconnect.dto.response.LeaderboardEntry;
import com.gigconnect.security.SecurityUtils;
import com.gigconnect.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/ratings")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> submitRating(@Valid @RequestBody RatingRequest request) {
        ratingService.submitRating(SecurityUtils.getCurrentUserId(), request);
        return ApiResponse.ok("Rating submitted successfully");
    }

    @GetMapping("/leaderboard")
    public ApiResponse<List<LeaderboardEntry>> getLeaderboard() {
        return ApiResponse.ok(ratingService.getLeaderboard());
    }
}
