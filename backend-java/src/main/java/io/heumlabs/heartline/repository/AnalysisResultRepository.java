package io.heumlabs.heartline.repository;

import io.heumlabs.heartline.domain.AnalysisResult;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** api/analysis + 대화 목록의 분석 요약 조회 대응. */
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, UUID> {

    Optional<AnalysisResult> findByConversationId(UUID conversationId);
}
