package io.heumlabs.heartline.conversation.dto;

import io.heumlabs.heartline.domain.ConversationImage;
import java.util.List;

/** schemas/conversation.py 의 ImageUploadResponse 대응. */
public record ImageUploadResponse(
        int uploaded,
        List<ConversationImageResponse> images
) {
    public static ImageUploadResponse from(List<ConversationImage> images) {
        return new ImageUploadResponse(
                images.size(),
                images.stream().map(ConversationImageResponse::from).toList()
        );
    }
}
