package com.gigconnect.repository;

import com.gigconnect.entity.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JobCategoryRepository extends JpaRepository<JobCategory, UUID> {}
