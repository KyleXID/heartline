package io.heumlabs.heartline.target.dto;

import io.heumlabs.heartline.domain.Target;
import java.time.OffsetDateTime;
import java.util.UUID;

/** schemas/target.py 의 TargetResponse 대응. */
public record TargetResponse(
        UUID id,
        String nickname,
        String memo,
        String relationshipGoal,
        OffsetDateTime createdAt
) {
    public static TargetResponse from(Target target) {
        return new TargetResponse(
                target.getId(),
                target.getNickname(),
                target.getMemo(),
                target.getRelationshipGoal(),
                target.getCreatedAt()
        );
    }
}
