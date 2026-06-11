package com.gigconnect.service;

import com.gigconnect.dto.request.JobRequest;
import com.gigconnect.dto.response.JobResponse;
import com.gigconnect.dto.response.PageResponse;
import com.gigconnect.entity.Job;
import com.gigconnect.entity.User;
import com.gigconnect.exception.BadRequestException;
import com.gigconnect.exception.ForbiddenException;
import com.gigconnect.exception.ResourceNotFoundException;
import com.gigconnect.repository.JobRepository;
import com.gigconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;

    @Transactional
    public JobResponse createJob(UUID clientId, JobRequest request) {
        User client = getUser(clientId);
        if (client.getRole() != User.Role.CLIENT) {
            throw new ForbiddenException("Only clients can post jobs");
        }

        Job job = Job.builder()
                .client(client)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .budget(request.getBudget())
                .requiredSkills(request.getRequiredSkills())
                .build();

        return JobService.toResponse(jobRepository.save(job));
    }

    public PageResponse<JobResponse> getJobs(String status, String category,
                                             String search, int page, int size) {
        Job.Status jobStatus = status != null ? Job.Status.valueOf(status.toUpperCase()) : null;
        Page<Job> jobs = jobRepository.findWithFilters(jobStatus, category, search,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "postedAt")));

        return PageResponse.<JobResponse>builder()
                .content(jobs.getContent().stream().map(JobService::toResponse).toList())
                .page(page).size(size)
                .totalElements(jobs.getTotalElements())
                .totalPages(jobs.getTotalPages())
                .last(jobs.isLast())
                .build();
    }

    public JobResponse getJobById(UUID id) {
        return JobService.toResponse(jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id.toString())));
    }

    public List<JobResponse> getMyJobs(UUID userId) {
        User user = getUser(userId);
        List<Job> jobs = user.getRole() == User.Role.CLIENT
                ? jobRepository.findByClientOrderByPostedAtDesc(user)
                : jobRepository.findByWorkerOrderByPostedAtDesc(user);
        return jobs.stream().map(JobService::toResponse).toList();
    }

    @Transactional
    public JobResponse acceptJob(UUID workerId, UUID jobId) {
        User worker = getUser(workerId);
        if (worker.getRole() != User.Role.WORKER) {
            throw new ForbiddenException("Only workers can accept jobs");
        }

        Job job = getJob(jobId);
        if (job.getStatus() != Job.Status.OPEN) {
            throw new BadRequestException("Job is not open for acceptance");
        }

        job.setWorker(worker);
        job.setStatus(Job.Status.IN_PROGRESS);
        job.setAcceptedAt(Instant.now());

        return JobService.toResponse(jobRepository.save(job));
    }

    @Transactional
    public JobResponse submitProof(UUID workerId, UUID jobId,
                                   String proofImageUrl, String proofLocation) {
        Job job = jobRepository.findByIdAndWorker(jobId, getUser(workerId))
                .orElseThrow(() -> new ForbiddenException("Job not found or not assigned to you"));

        if (job.getStatus() != Job.Status.IN_PROGRESS) {
            throw new BadRequestException("Job is not in progress");
        }

        job.setProofImageUrl(proofImageUrl);
        job.setProofLocation(proofLocation);
        job.setStatus(Job.Status.AWAITING_APPROVAL);

        return JobService.toResponse(jobRepository.save(job));
    }

    @Transactional
    public JobResponse approveJob(UUID clientId, UUID jobId) {
        Job job = jobRepository.findByIdAndClient(jobId, getUser(clientId))
                .orElseThrow(() -> new ForbiddenException("Job not found or you are not the client"));

        if (job.getStatus() != Job.Status.AWAITING_APPROVAL) {
            throw new BadRequestException("Job is not awaiting approval");
        }

        job.setStatus(Job.Status.COMPLETED);
        job.setCompletedAt(Instant.now());
        Job saved = jobRepository.save(job);

        walletService.transferPayment(clientId, job.getWorker().getId(), job.getBudget(), saved);

        return JobService.toResponse(saved);
    }

    @Transactional
    public JobResponse cancelJob(UUID userId, UUID jobId) {
        Job job = getJob(jobId);
        User user = getUser(userId);

        boolean isClient = job.getClient().getId().equals(userId);
        boolean isWorker = job.getWorker() != null && job.getWorker().getId().equals(userId);
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isClient && !isWorker && !isAdmin) {
            throw new ForbiddenException("Not authorized to cancel this job");
        }

        if (job.getStatus() == Job.Status.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed job");
        }

        job.setStatus(Job.Status.CANCELLED);
        return JobService.toResponse(jobRepository.save(job));
    }

    private User getUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id.toString()));
    }

    private Job getJob(UUID id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id.toString()));
    }

    public static JobResponse toResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .client(job.getClient() != null ? AuthService.toUserResponse(job.getClient()) : null)
                .worker(job.getWorker() != null ? AuthService.toUserResponse(job.getWorker()) : null)
                .title(job.getTitle())
                .description(job.getDescription())
                .category(job.getCategory())
                .location(job.getLocation())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .budget(job.getBudget())
                .status(job.getStatus())
                .requiredSkills(job.getRequiredSkills())
                .proofImageUrl(job.getProofImageUrl())
                .postedAt(job.getPostedAt())
                .acceptedAt(job.getAcceptedAt())
                .completedAt(job.getCompletedAt())
                .build();
    }
}