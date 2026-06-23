package io.heumlabs.heartline.repository;

import io.heumlabs.heartline.domain.ConversationImage;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/** 단방향 설계라 대화 이미지는 이 레포지토리로 조회한다(Conversation 에 컬렉션 미보유). */
public interface ConversationImageRepository extends JpaRepository<ConversationImage, UUID> {

    // 필드명 order 가 JPQL ORDER BY 토큰과 겹치므로, 파서 모호성을 없애려 쿼리를 명시한다.
    @Query("SELECT ci FROM ConversationImage ci WHERE ci.conversation.id = :conversationId ORDER BY ci.order ASC")
    List<ConversationImage> findByConversationIdOrderByOrderAsc(@Param("conversationId") UUID conversationId);

    long countByConversationId(UUID conversationId);
}
