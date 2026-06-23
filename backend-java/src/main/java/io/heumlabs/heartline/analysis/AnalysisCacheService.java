package io.heumlabs.heartline.analysis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.heumlabs.heartline.analysis.dto.AnalysisResultResponse;
import java.time.Duration;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

/** core/cache.py 의 분석 결과 캐싱 대응. key "analysis:{id}", TTL 24h. */
@Service
public class AnalysisCacheService {

    private static final Logger log = LoggerFactory.getLogger(AnalysisCacheService.class);
    private static final Duration TTL = Duration.ofHours(24);

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    public AnalysisCacheService(StringRedisTemplate redis, ObjectMapper objectMapper) {
        this.redis = redis;
        this.objectMapper = objectMapper;
    }

    private String key(String conversationId) {
        return "analysis:" + conversationId;
    }

    public Optional<AnalysisResultResponse> get(String conversationId) {
        String data = redis.opsForValue().get(key(conversationId));
        if (data == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(data, AnalysisResultResponse.class));
        } catch (JsonProcessingException e) {
            log.warn("analysis_cache_read_failed conversationId={}", conversationId, e);
            return Optional.empty();
        }
    }

    public void set(String conversationId, AnalysisResultResponse value) {
        try {
            redis.opsForValue().set(key(conversationId), objectMapper.writeValueAsString(value), TTL);
        } catch (JsonProcessingException e) {
            log.warn("analysis_cache_write_failed conversationId={}", conversationId, e);
        }
    }

    public void invalidate(String conversationId) {
        redis.delete(key(conversationId));
    }
}
