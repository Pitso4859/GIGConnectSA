package com.gigconnect.repository;

import com.gigconnect.entity.Transaction;
import com.gigconnect.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByWalletOrderByCreatedAtDesc(Wallet wallet);
}
