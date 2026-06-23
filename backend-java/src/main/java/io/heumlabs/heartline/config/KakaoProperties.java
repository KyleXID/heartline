package io.heumlabs.heartline.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** config.py 의 카카오 OAuth 설정 대응. */
@ConfigurationProperties(prefix = "heartline.kakao")
public record KakaoProperties(
        String clientId,
        String clientSecret,
        String redirectUri
) {
}
