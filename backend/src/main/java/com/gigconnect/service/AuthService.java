package com.gigconnect.service;

import com.gigconnect.dto.request.LoginRequest;
import com.gigconnect.dto.request.RegisterRequest;
import com.gigconnect.dto.response.AuthResponse;
import com.gigconnect.dto.response.UserResponse;
import com.gigconnect.dto.response.UserSummary;
import com.gigconnect.entity.RefreshToken;
import com.gigconnect.entity.User;
import com.gigconnect.entity.Wallet;
import com.gigconnect.exception.BadRequestException;
import com.gigconnect.exception.ResourceNotFoundException;
import com.gigconnect.repository.RefreshTokenRepository;
import com.gigconnect.repository.UserRepository;
import com.gigconnect.repository.WalletRepository;
import com.gigconnect.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .phone(request.phone())
                .build();

        user = userRepository.save(user);

        // Auto-create wallet with starter balance
        Wallet wallet = Wallet.builder().user(user).build();
        walletRepository.save(wallet);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated");
        }

        // Revoke existing refresh tokens
        refreshTokenRepository.revokeAllByUser(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token expired or revoked");
        }

        // Rotate: revoke old, issue new
        rt.setRevoked(true);
        refreshTokenRepository.save(rt);

        return buildAuthResponse(rt.getUser());
    }

    @Transactional
    public void logout(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));
        refreshTokenRepository.revokeAllByUser(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());

        String rawRefreshToken = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(rawRefreshToken)
                .expiresAt(Instant.now().plusMillis(refreshTokenExpiration))
                .build();
        refreshTokenRepository.save(refreshToken);

        // AuthResponse is a record — use its canonical constructor directly
        return new AuthResponse(accessToken, rawRefreshToken, UserSummary.from(user));
    }

    // Kept for backward compat with JobService / UserService which still use UserResponse
    public static UserResponse toUserResponse(User user) {
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
                .build();
    }
}
