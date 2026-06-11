package com.gigconnect.service;

import com.gigconnect.dto.request.RatingRequest;
import com.gigconnect.dto.response.LeaderboardEntry;
import com.gigconnect.entity.Job;
import com.gigconnect.entity.Rating;
import com.gigconnect.entity.User;
import com.gigconnect.exception.BadRequestException;
import com.gigconnect.exception.ForbiddenException;
import com.gigconnect.exception.ResourceNotFoundException;
import com.gigconnect.repository.JobRepository;
import com.gigconnect.repository.RatingRepository;
import com.gigconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public void submitRating(UUID raterId, RatingRequest request) {
        Job job = jobRepository.findById(request.jobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", request.jobId().toString()));

        if (job.getStatus() != Job.Status.COMPLETED) {
            throw new BadRequestException("Can only rate completed jobs");
        }

        User rater = getUser(raterId);
        boolean isClient = job.getClient().getId().equals(raterId);
        boolean isWorker = job.getWorker() != null && job.getWorker().getId().equals(raterId);

        if (!isClient && !isWorker) {
            throw new ForbiddenException("You are not part of this job");
        }

        if (ratingRepository.findByJobIdAndRaterId(job.getId(), raterId).isPresent()) {
            throw new BadRequestException("You have already rated this job");
        }

        User ratee = isClient ? job.getWorker() : job.getClient();
        if (ratee == null) throw new BadRequestException("No one to rate");

        Rating rating = Rating.builder()
                .job(job)
                .rater(rater)
                .ratee(ratee)
                .score(request.score())
                .comment(request.comment())
                .build();

        ratingRepository.save(rating);
    }

    public List<LeaderboardEntry> getLeaderboard() {
        List<Object[]> rows = ratingRepository.findLeaderboard();
        List<LeaderboardEntry> board = new ArrayList<>();

        for (int i = 0; i < rows.size(); i++) {
            Object[] row = rows.get(i);
            UUID uid = (UUID) row[0];
            long completed = jobRepository.findByWorkerOrderByPostedAtDesc(getUser(uid))
                    .stream().filter(j -> j.getStatus() == Job.Status.COMPLETED).count();

            double avg = ((Number) row[3]).doubleValue();
            long total = ((Number) row[4]).longValue();

            board.add(LeaderboardEntry.builder()
                    .rank(i + 1)
                    .userId(uid)
                    .fullName((String) row[1])
                    .avatarUrl((String) row[2])
                    .averageRating(avg)
                    .totalRatings(total)
                    .totalJobsCompleted(completed)
                    .badge(computeBadge(avg, completed))
                    .build());
        }
        return board;
    }

    private String computeBadge(double avg, long completed) {
        if (avg >= 4.8 && completed >= 20) return "ELITE";
        if (avg >= 4.5 && completed >= 10) return "GOLD";
        if (avg >= 4.0 && completed >= 5)  return "SILVER";
        if (avg >= 3.5)                     return "BRONZE";
        return "NEWCOMER";
    }

    private User getUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id.toString()));
    }
}