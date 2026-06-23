package io.heumlabs.heartline.conversation.dto;

import io.heumlabs.heartline.domain.Conversation;
import io.heumlabs.heartline.domain.ConversationImage;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/** schemas/conversation.py 의 ConversationResponse 대응. */
public record ConversationResponse(
        UUID id,
        UUID userId,
        UUID targetId,
        String status,
        OffsetDateTime createdAt,
        List<ConversationImageResponse> images
) {
    public static ConversationResponse from(Conversation conv, List<ConversationImage> images) {
        return new ConversationResponse(
                conv.getId(),
                conv.getUser().getId(),
                conv.getTarget().getId(),
                conv.getStatus(),
                conv.getCreatedAt(),
                images.stream().map(ConversationImageResponse::from).toList()
        );
    }
}
