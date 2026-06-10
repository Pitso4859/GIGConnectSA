package com.gigconnect.repository;

import com.gigconnect.entity.Rating;
import com.gigconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<Rating, UUID> {
    List<Rating> findByRatee(User ratee);
    Optional<Rating> findByJobIdAndRaterId(UUID jobId, UUID raterId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.ratee = :user")
    Optional<Double> findAverageScoreByRatee(@Param("user") User user);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.ratee = :user")
    long countByRatee(@Param("user") User user);

    @Query("""
        SELECT r.ratee.id, r.ratee.fullName, r.ratee.avatarUrl,
               AVG(r.score) AS avgScore, COUNT(r) AS totalRatings
        FROM Rating r
        WHERE r.ratee.role = 'WORKER'
        GROUP BY r.ratee.id, r.ratee.fullName, r.ratee.avatarUrl
        ORDER BY AVG(r.score) DESC, COUNT(r) DESC
    """)
    List<Object[]> findLeaderboard();
}
