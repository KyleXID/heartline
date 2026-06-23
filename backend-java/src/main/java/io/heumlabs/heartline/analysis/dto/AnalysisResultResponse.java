package io.heumlabs.heartline.analysis.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.heumlabs.heartline.domain.AnalysisResult;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * schemas/analysis.py 의 AnalysisResultResponse 대응.
 * <p>Redis 캐시에 JSON 으로 직렬화/역직렬화되므로 record 컴포넌트만으로 왕복 가능해야 한다.
 */
@JsonInclude(JsonInclude.Include.ALWAYS)
public record AnalysisResultResponse(
        UUID id,
        UUID conversationId,
        int interestScore,
        double temperature,
        List<Map<String, Object>> emotionTimeline,
        List<Map<String, Object>> redFlags,
        Map<String, Object> replyTimingAdvice,
        List<Map<String, Object>> suggestedReplies,
        OffsetDateTime createdAt
) {
    public static AnalysisResultResponse from(AnalysisResult r) {
        return new AnalysisResultResponse(
                r.getId(),
                r.getConversation().getId(),
                r.getInterestScore(),
                r.getTemperature(),
                r.getEmotionTimeline(),
                r.getRedFlags(),
                r.getReplyTimingAdvice(),
                r.getSuggestedReplies(),
                r.getCreatedAt()
        );
    }
}
