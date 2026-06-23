package io.heumlabs.heartline.conversation.dto;

import io.heumlabs.heartline.domain.ConversationImage;
import java.time.OffsetDateTime;
import java.util.UUID;

/** schemas/conversation.py 의 ConversationImageResponse 대응. */
public record ConversationImageResponse(
        UUID id,
        String imageFile,
        int order,
        String ocrText,
        OffsetDateTime createdAt
) {
    public static ConversationImageResponse from(ConversationImage image) {
        return new ConversationImageResponse(
                image.getId(),
                image.getImageFile(),
                image.getOrder(),
                image.getOcrText(),
                image.getCreatedAt()
        );
    }
}
