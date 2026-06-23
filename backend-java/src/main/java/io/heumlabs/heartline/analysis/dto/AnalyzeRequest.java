package io.heumlabs.heartline.analysis.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** schemas/analysis.py 의 AnalyzeRequest 대응. */
public record AnalyzeRequest(
        @NotNull UUID conversationId
) {
}
