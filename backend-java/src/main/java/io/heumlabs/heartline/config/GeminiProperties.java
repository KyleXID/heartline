package io.heumlabs.heartline.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** config.py 의 Gemini 설정 대응. */
@ConfigurationProperties(prefix = "heartline.gemini")
public record GeminiProperties(
        String apiKey,
        String model
) {
}
