package com.gigconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.WORKER;

    @Column(name = "avatar_url")
    private String avatarUrl;

    private String bio;
    private String location;

    @Column(name = "id_number")
    private String idNumber;

    @Builder.Default
    @Column(name = "is_verified")
    private boolean isVerified = false;

    @Builder.Default
    @Column(name = "is_active")
    private boolean isActive = true;

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp @Column(name = "updated_at")
    private Instant updatedAt;

    public enum Role { WORKER, CLIENT, ADMIN }
}
