package io.heumlabs.heartline.domain;

import io.heumlabs.heartline.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * AI 분석 결과 (관심도, 온도, Red Flag 등). models/analysis_result.py 대응.
 * <p>JSONB 컬럼은 Hibernate 6 의 {@code @JdbcTypeCode(SqlTypes.JSON)} 으로 매핑.
 */
@Entity
@Table(name = "analysis_results")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class AnalysisResult extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false, unique = true)
    private Conversation conversation;

    /** 0~100 상대방 관심도. */
    @Column(name = "interest_score", nullable = false)
    private int interestScore;

    /** 0.0~100.0 대화 온도. */
    @Column(nullable = false)
    private double temperature;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "emotion_timeline", columnDefinition = "jsonb")
    private List<Map<String, Object>> emotionTimeline;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "red_flags", columnDefinition = "jsonb")
    private List<Map<String, Object>> redFlags;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "reply_timing_advice", columnDefinition = "jsonb")
    private Map<String, Object> replyTimingAdvice;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "suggested_replies", columnDefinition = "jsonb")
    private List<Map<String, Object>> suggestedReplies;
}
