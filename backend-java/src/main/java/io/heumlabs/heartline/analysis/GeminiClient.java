package io.heumlabs.heartline.analysis;

import io.heumlabs.heartline.config.GeminiProperties;
import java.util.List;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Gemini 분석 호출. services/analysis.py 의 genai.Client 대응.
 * <p>google-genai Java SDK 대신 REST(generateContent)를 직접 호출해 의존성/버전 리스크를 줄였다.
 */
@Component
public class GeminiClient {

    private static final String BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/";
    private static final ParameterizedTypeReference<Map<String, Object>> MAP_TYPE =
            new ParameterizedTypeReference<>() {
            };

    private final RestClient restClient;
    private final GeminiProperties properties;

    public GeminiClient(GeminiProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.create();
    }

    /** 프롬프트를 보내고 JSON 형식 응답 텍스트를 반환. */
    @SuppressWarnings("unchecked")
    public String generateJson(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        // Gemini REST generationConfig 는 camelCase 키를 사용한다(SNAKE_CASE 전역설정은
                        // POJO 필드에만 적용되고 Map key 에는 적용되지 않으므로 명시적으로 camelCase).
                        "responseMimeType", "application/json",
                        "temperature", 0.7));

        String uri = BASE_URL + properties.model() + ":generateContent?key=" + properties.apiKey();

        Map<String, Object> response = restClient.post()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(MAP_TYPE);

        if (response == null) {
            throw new IllegalStateException("Gemini 응답이 비어있습니다.");
        }
        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini 응답에 candidates 가 없습니다.");
        }
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            throw new IllegalStateException("Gemini 응답에 parts 가 없습니다.");
        }
        return (String) parts.get(0).get("text");
    }
}
