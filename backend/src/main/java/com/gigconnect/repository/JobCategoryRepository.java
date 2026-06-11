package com.gigconnect.repository;

import com.gigconnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

/**
 * Placeholder repository — JobCategory entity not yet implemented.
 * Reuses Job entity temporarily so the project compiles.
 */
public interface JobCategoryRepository extends JpaRepository<Job, UUID> {
}