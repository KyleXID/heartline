package io.heumlabs.heartline.service.parser.dto;

import java.time.OffsetDateTime;

/** parse_ocr_text 결과 {"sender_type", "content", "sent_at"} 대응. */
public record ParsedMessage(
        String senderType,
        String content,
        OffsetDateTime sentAt
) {
}
