package com.gigconnect.controller;

import com.gigconnect.dto.request.JobRequest;
import com.gigconnect.dto.response.ApiResponse;
import com.gigconnect.dto.response.JobResponse;
import com.gigconnect.dto.response.PageResponse;
import com.gigconnect.security.SecurityUtils;
import com.gigconnect.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ApiResponse<PageResponse<JobResponse>> getJobs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ApiResponse.ok(jobService.getJobs(status, category, search, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<JobResponse> getJob(@PathVariable UUID id) {
        return ApiResponse.ok(jobService.getJobById(id));
    }

    @GetMapping("/my")
    public ApiResponse<List<JobResponse>> getMyJobs() {
        return ApiResponse.ok(jobService.getMyJobs(SecurityUtils.getCurrentUserId()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<JobResponse> createJob(@Valid @RequestBody JobRequest request) {
        return ApiResponse.ok("Job posted successfully",
                jobService.createJob(SecurityUtils.getCurrentUserId(), request));
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasRole('WORKER')")
    public ApiResponse<JobResponse> acceptJob(@PathVariable UUID id) {
        return ApiResponse.ok("Job accepted", jobService.acceptJob(SecurityUtils.getCurrentUserId(), id));
    }

    @PatchMapping("/{id}/submit-proof")
    @PreAuthorize("hasRole('WORKER')")
    public ApiResponse<JobResponse> submitProof(
            @PathVariable UUID id,
            @RequestParam(required = false) String proofImageUrl,
            @RequestParam(required = false) String proofLocation) {
        return ApiResponse.ok("Proof submitted",
                jobService.submitProof(SecurityUtils.getCurrentUserId(), id, proofImageUrl, proofLocation));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<JobResponse> approveJob(@PathVariable UUID id) {
        return ApiResponse.ok("Job approved and payment transferred",
                jobService.approveJob(SecurityUtils.getCurrentUserId(), id));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<JobResponse> cancelJob(@PathVariable UUID id) {
        return ApiResponse.ok("Job cancelled",
                jobService.cancelJob(SecurityUtils.getCurrentUserId(), id));
    }
}
