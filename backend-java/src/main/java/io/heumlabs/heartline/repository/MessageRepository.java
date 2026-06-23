package io.heumlabs.heartline.repository;

import io.heumlabs.heartline.domain.Message;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** services/parser.py(save_parsed_messages) + analysis.py 의 메시지 조회 대응. */
public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByConversationId(UUID conversationId);
}
