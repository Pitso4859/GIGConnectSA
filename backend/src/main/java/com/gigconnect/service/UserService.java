package com.gigconnect.service;

import com.gigconnect.dto.request.ProfileUpdateRequest;
import com.gigconnect.dto.response.UserResponse;
import com.gigconnect.entity.User;
import com.gigconnect.exception.ResourceNotFoundException;
import com.gigconnect.repository.JobRepository;
import com.gigconnect.repository.RatingRepository;
import com.gigconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final JobRepository jobRepository;

    public UserResponse getProfile(UUID userId) {
        User user = getUser(userId);
        return enrichUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, ProfileUpdateRequest request) {
        User user = getUser(userId);

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null)    user.setPhone(request.getPhone());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getBio() != null)      user.setBio(request.getBio());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getIdNumber() != null) user.setIdNumber(request.getIdNumber());

        return enrichUserResponse(userRepository.save(user));
    }

    public List<UserResponse> searchWorkers(String search) {
        return userRepository.searchWorkers(search).stream()
                .map(this::enrichUserResponse)
                .toList();
    }

    private UserResponse enrichUserResponse(User user) {
        double avg = ratingRepository.findAverageScoreByRatee(user).orElse(0.0);
        long completed = jobRepository.findByWorkerOrderByPostedAtDesc(user)
                .stream().filter(j -> j.getStatus() == com.gigconnect.entity.Job.Status.COMPLETED).count();

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .location(user.getLocation())
                .isVerified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .averageRating(Math.round(avg * 10.0) / 10.0)
                .totalJobsCompleted(completed)
                .build();
    }

    private User getUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id.toString()));
    }
}
