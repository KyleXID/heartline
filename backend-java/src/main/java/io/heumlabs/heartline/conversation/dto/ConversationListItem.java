package io.heumlabs.heartline.conversation.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

/** api/conversations 의 list_conversations 가 반환하던 dict 대응. */
public record ConversationListItem(
        UUID id,
        UUID targetId,
        String targetNickname,
        String status,
        OffsetDateTime createdAt,
        int imageCount,
        Integer interestScore,
        Double temperature
) {
}
