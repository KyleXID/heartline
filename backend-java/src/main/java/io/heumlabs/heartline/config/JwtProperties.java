package io.heumlabs.heartline.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** config.py 의 JWT 설정 대응. */
@ConfigurationProperties(prefix = "heartline.jwt")
public record JwtProperties(
        String secretKey,
        String algorithm,
        long accessTokenExpireMinutes,
        long refreshTokenExpireDays
) {
}
