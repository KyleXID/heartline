package io.heumlabs.heartline.repository;

import io.heumlabs.heartline.domain.Conversation;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

/** api/conversations + services/conversation.py 의 조회 대응. */
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @EntityGraph(attributePaths = "target")
    Optional<Conversation> findByIdAndUserId(UUID id, UUID userId);

    @EntityGraph(attributePaths = "target")
    List<Conversation> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
