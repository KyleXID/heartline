package io.heumlabs.heartline.analysis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.heumlabs.heartline.common.exception.ApiException;
import io.heumlabs.heartline.domain.AnalysisResult;
import io.heumlabs.heartline.domain.Conversation;
import io.heumlabs.heartline.domain.Message;
import io.heumlabs.heartline.domain.Target;
import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.repository.AnalysisResultRepository;
import io.heumlabs.heartline.repository.ConversationRepository;
import io.heumlabs.heartline.repository.MessageRepository;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** services/analysis.py + api/analysis.py 의 비즈니스 로직 대응. 소유권 검증·조회를 서비스에서 일원화한다. */
@Service
public class AnalysisService {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    private static final String ANALYSIS_PROMPT = """
            당신은 연애 전문 상담사입니다. 아래 카카오톡 대화를 분석해주세요.

            ## 대화 참여자
            - "나": 사용자 (코칭 대상)
            - "상대": 상대방 (분석 대상)
            - 관계 목표: {relationship_goal}

            ## 대화 내용
            {conversation_text}

            ## 분석 요청
            다음 JSON 형식으로 정확히 응답해주세요. 다른 텍스트 없이 JSON만 출력:

            {
              "interest_score": 0~100 사이 정수 (상대방의 관심도. 0=무관심, 100=매우 높은 관심),
              "temperature": 0.0~100.0 사이 실수 (대화 분위기 온도. 0=차가움, 100=뜨거움),
              "emotion_timeline": [
                {"phase": "초반/중반/후반", "emotion": "감정 키워드", "intensity": 0~10}
              ],
              "red_flags": [
                {"type": "읽씹/관심하락/회피/거리두기 등", "description": "구체적 설명", "severity": "low/medium/high"}
              ],
              "reply_timing": {
                "recommendation": "지금 바로/30분 후/1시간 후/내일 오전/내일 저녁 중 선택",
                "reason": "추천 이유"
              },
              "suggested_replies": [
                {"tone": "가벼운", "message": "추천 답장 문구", "explanation": "이 톤을 추천하는 이유"},
                {"tone": "진지한", "message": "추천 답장 문구", "explanation": "이 톤을 추천하는 이유"},
                {"tone": "재치있는", "message": "추천 답장 문구", "explanation": "이 톤을 추천하는 이유"}
              ],
              "summary": "2~3문장 종합 분석 코멘트 (한국어)"
            }
            """;

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public AnalysisService(ConversationRepository conversationRepository,
            MessageRepository messageRepository, AnalysisResultRepository analysisResultRepository,
            GeminiClient geminiClient, ObjectMapper objectMapper) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.analysisResultRepository = analysisResultRepository;
        this.geminiClient = geminiClient;
        this.objectMapper = objectMapper;
    }

    /** 대화 소유권 검증. 캐시 조회보다 먼저 호출해야 한다. */
    @Transactional(readOnly = true)
    public void requireOwnedConversation(User user, UUID conversationId) {
        if (conversationRepository.findByIdAndUserId(conversationId, user.getId()).isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "대화를 찾을 수 없습니다.");
        }
    }

    /** 저장된 분석 결과 조회. 호출 전 소유권 검증을 마쳐야 한다. */
    @Transactional(readOnly = true)
    public AnalysisResult findResult(UUID conversationId) {
        return analysisResultRepository.findByConversationId(conversationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "분석 결과가 아직 없습니다."));
    }

    /** 대화 분석 실행 및 결과 저장(소유권 검증 포함). */
    @Transactional
    public AnalysisResult runAnalysis(User user, UUID conversationId) {
        Conversation conv = conversationRepository.findByIdAndUserId(conversationId, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "대화를 찾을 수 없습니다."));

        List<Message> messages = messageRepository.findByConversationId(conversationId);
        if (messages.isEmpty()) {
            // 원본의 ValueError → 컨트롤러에서 400 으로 변환되던 흐름
            throw new ApiException(HttpStatus.BAD_REQUEST, "분석할 메시지가 없습니다.");
        }

        Target target = conv.getTarget();
        String goal = (target != null && target.getRelationshipGoal() != null)
                ? target.getRelationshipGoal() : "미설정";

        String prompt = ANALYSIS_PROMPT
                .replace("{relationship_goal}", goal)
                .replace("{conversation_text}", formatMessages(messages));

        Map<String, Object> data = parseJson(geminiClient.generateJson(prompt));

        AnalysisResult result = analysisResultRepository.findByConversationId(conversationId)
                .orElseGet(() -> AnalysisResult.builder().conversation(conv).build());

        result.setInterestScore(((Number) data.get("interest_score")).intValue());
        result.setTemperature(((Number) data.get("temperature")).doubleValue());
        result.setEmotionTimeline(asList(data.get("emotion_timeline")));
        result.setRedFlags(asList(data.get("red_flags")));
        result.setReplyTimingAdvice(asMap(data.get("reply_timing")));
        result.setSuggestedReplies(asList(data.get("suggested_replies")));
        analysisResultRepository.save(result);

        conv.setStatus("analyzed");
        return result;
    }

    private String formatMessages(List<Message> messages) {
        return messages.stream()
                .sorted(Comparator.comparing((Message m) ->
                        m.getSentAt() != null ? m.getSentAt() : m.getCreatedAt()))
                .map(m -> {
                    String sender = "me".equals(m.getSenderType()) ? "나" : "상대";
                    String time = m.getSentAt() != null ? m.getSentAt().format(TIME_FMT) : "";
                    return "[" + sender + "] " + time + " " + m.getContent();
                })
                .collect(Collectors.joining("\n"));
    }

    private Map<String, Object> parseJson(String json) {
        String cleaned = json.strip();
        // JSON 모드에서도 모델이 ```json ... ``` 펜스를 붙이는 경우를 방어적으로 제거
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```(?:json)?\\s*", "").replaceAll("\\s*```$", "");
        }
        try {
            return objectMapper.readValue(cleaned, new TypeReference<Map<String, Object>>() {
            });
        } catch (Exception e) {
            throw new IllegalStateException("Gemini 응답 JSON 파싱 실패", e);
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> asList(Object value) {
        return value instanceof List ? (List<Map<String, Object>>) value : List.of();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        return value instanceof Map ? (Map<String, Object>) value : Map.of();
    }
}
