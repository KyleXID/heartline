package io.heumlabs.heartline.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** config.py 의 cors_origins 대응. 콤마 구분 문자열을 List 로 바인딩. */
@ConfigurationProperties(prefix = "heartline.cors")
public record CorsProperties(
        List<String> allowedOrigins
) {
}
