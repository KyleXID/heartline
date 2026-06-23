package io.heumlabs.heartline.conversation.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** schemas/conversation.py 의 ConversationCreate 대응. */
public record ConversationCreateRequest(
        @NotNull UUID targetId
) {
}
