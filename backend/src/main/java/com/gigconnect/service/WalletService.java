package com.gigconnect.service;

import com.gigconnect.dto.response.WalletResponse;
import com.gigconnect.entity.Job;
import com.gigconnect.entity.Transaction;
import com.gigconnect.entity.User;
import com.gigconnect.entity.Wallet;
import com.gigconnect.exception.BadRequestException;
import com.gigconnect.exception.ResourceNotFoundException;
import com.gigconnect.repository.TransactionRepository;
import com.gigconnect.repository.UserRepository;
import com.gigconnect.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public WalletResponse getWallet(UUID userId) {
        Wallet wallet = getOrCreateWallet(userId);
        List<Transaction> transactions = transactionRepository.findByWalletOrderByCreatedAtDesc(wallet);

        return WalletResponse.builder()
                .id(wallet.getId())
                .balance(wallet.getBalance())
                .updatedAt(wallet.getUpdatedAt())
                .transactions(transactions.stream().map(this::toTxResponse).toList())
                .build();
    }

    @Transactional
    public void transferPayment(UUID clientId, UUID workerId, BigDecimal amount, Job job) {
        Wallet clientWallet = getOrCreateWallet(clientId);
        Wallet workerWallet = getOrCreateWallet(workerId);

        if (clientWallet.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient wallet balance");
        }

        // Debit client
        clientWallet.setBalance(clientWallet.getBalance().subtract(amount));
        walletRepository.save(clientWallet);

        Transaction debit = Transaction.builder()
                .wallet(clientWallet)
                .job(job)
                .type(Transaction.Type.DEBIT)
                .amount(amount)
                .description("Payment for: " + job.getTitle())
                .reference("PAY-" + job.getId())
                .build();
        transactionRepository.save(debit);

        // Credit worker
        workerWallet.setBalance(workerWallet.getBalance().add(amount));
        walletRepository.save(workerWallet);

        Transaction credit = Transaction.builder()
                .wallet(workerWallet)
                .job(job)
                .type(Transaction.Type.CREDIT)
                .amount(amount)
                .description("Received payment for: " + job.getTitle())
                .reference("REC-" + job.getId())
                .build();
        transactionRepository.save(credit);

        log.info("Payment transfer: R{} from user {} to user {}", amount, clientId, workerId);
    }

    private Wallet getOrCreateWallet(UUID userId) {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));
            Wallet w = Wallet.builder().user(user).build();
            return walletRepository.save(w);
        });
    }

    private WalletResponse.TransactionResponse toTxResponse(Transaction tx) {
        return WalletResponse.TransactionResponse.builder()
                .id(tx.getId())
                .type(tx.getType().name())
                .amount(tx.getAmount())
                .description(tx.getDescription())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
