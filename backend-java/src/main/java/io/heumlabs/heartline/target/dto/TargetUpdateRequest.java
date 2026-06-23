package io.heumlabs.heartline.target.dto;

import jakarta.validation.constraints.Size;

/**
 * schemas/target.py 의 TargetUpdate 대응 (부분 수정).
 * <p>null 필드는 "변경 안 함"으로 처리한다(PATCH 관례). 명시적 null 로 값을 비우는 동작은 지원하지 않는다.
 */
public record TargetUpdateRequest(
        @Size(min = 1, max = 50) String nickname,
        String memo,
        String relationshipGoal
) {
}
