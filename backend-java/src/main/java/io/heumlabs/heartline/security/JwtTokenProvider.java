package io.heumlabs.heartline.security;

import io.heumlabs.heartline.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

/**
 * JWT 발급/검증. core/security.py 의 create_access_token/create_refresh_token/decode_token 대응.
 * <p>HS256 + 동일 secret 이면 기존 pyjwt 토큰과 상호 호환된다.
 * refresh 토큰은 {@code type=refresh} 클레임으로 구분한다.
 */
@Component
public class JwtTokenProvider {

    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_REFRESH = "refresh";

    private final SecretKey key;
    private final long accessTokenExpireMinutes;
    private final long refreshTokenExpireDays;

    public JwtTokenProvider(JwtProperties properties) {
        this.key = Keys.hmacShaKeyFor(properties.secretKey().getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpireMinutes = properties.accessTokenExpireMinutes();
        this.refreshTokenExpireDays = properties.refreshTokenExpireDays();
    }

    public String createAccessToken(String subject) {
        Instant now = Instant.now();
        Instant expiry = now.plus(accessTokenExpireMinutes, ChronoUnit.MINUTES);
        return Jwts.builder()
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public String createRefreshToken(String subject) {
        Instant now = Instant.now();
        Instant expiry = now.plus(refreshTokenExpireDays, ChronoUnit.DAYS);
        return Jwts.builder()
                .subject(subject)
                .claim(CLAIM_TYPE, TYPE_REFRESH)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    /** 서명/만료 검증 후 클레임 반환. 실패 시 {@link io.jsonwebtoken.JwtException} 계열 예외. */
    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isRefreshToken(Claims claims) {
        return TYPE_REFRESH.equals(claims.get(CLAIM_TYPE, String.class));
    }
}
