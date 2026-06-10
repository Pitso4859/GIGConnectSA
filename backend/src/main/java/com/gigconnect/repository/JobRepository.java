package com.gigconnect.repository;

import com.gigconnect.entity.Job;
import com.gigconnect.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobRepository extends JpaRepository<Job, UUID> {
    Page<Job> findByStatusOrderByPostedAtDesc(Job.Status status, Pageable pageable);

    @Query("""
        SELECT j FROM Job j LEFT JOIN FETCH j.client LEFT JOIN FETCH j.worker
        WHERE (:status IS NULL OR j.status = :status)
        AND (:category IS NULL OR j.category = :category)
        AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%',:search,'%'))
             OR LOWER(j.description) LIKE LOWER(CONCAT('%',:search,'%')))
        ORDER BY j.postedAt DESC
    """)
    Page<Job> findWithFilters(@Param("status") Job.Status status,
                              @Param("category") String category,
                              @Param("search") String search,
                              Pageable pageable);

    List<Job> findByClientOrderByPostedAtDesc(User client);
    List<Job> findByWorkerOrderByPostedAtDesc(User worker);
    Optional<Job> findByIdAndClient(UUID id, User client);
    Optional<Job> findByIdAndWorker(UUID id, User worker);
}
