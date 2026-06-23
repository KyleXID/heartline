package io.heumlabs.heartline.auth;

import io.heumlabs.heartline.auth.dto.LoginRequest;
import io.heumlabs.heartline.auth.dto.RegisterRequest;
import io.heumlabs.heartline.auth.dto.TokenResponse;
import io.heumlabs.heartline.common.exception.ApiException;
import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.repository.UserRepository;
import io.heumlabs.heartline.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** services/auth.py + api/auth.py 의 비즈니스 로직 대응. */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "이미 등록된 이메일입니다.");
        }
        User user = User.builder()
                .email(request.email())
                .nickname(request.nickname())
                .hashedPassword(passwordEncoder.encode(request.password()))
                .gender(request.gender())
                .ageRange(request.ageRange())
                .build();
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email()).orElse(null);
        if (user == null || user.getHashedPassword() == null
                || !passwordEncoder.matches(request.password(), user.getHashedPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse refresh(String refreshToken) {
        Claims claims;
        try {
            claims = tokenProvider.parse(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "리프레시 토큰이 만료되었습니다.");
        } catch (JwtException | IllegalArgumentException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다.");
        }

        if (!tokenProvider.isRefreshToken(claims)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다.");
        }

        UUID userId;
        try {
            userId = UUID.fromString(claims.getSubject());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다.");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.isActive()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "사용자를 찾을 수 없습니다.");
        }
        return issueTokens(user);
    }

    /** access + refresh 토큰 발급. OAuth 로그인에서도 재사용. */
    public TokenResponse issueTokens(User user) {
        String subject = user.getId().toString();
        return TokenResponse.of(
                tokenProvider.createAccessToken(subject),
                tokenProvider.createRefreshToken(subject));
    }
}
