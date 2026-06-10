package com.gigconnect.repository;

import com.gigconnect.entity.User;
import com.gigconnect.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    Optional<Wallet> findByUser(User user);
    Optional<Wallet> findByUserId(UUID userId);
}
