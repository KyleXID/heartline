package io.heumlabs.heartline.target.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** schemas/target.py 의 TargetCreate 대응. */
public record TargetCreateRequest(
        @NotBlank @Size(min = 1, max = 50) String nickname,
        String memo,
        /** 썸→고백, 재회, 관계발전, 유지, 기타. */
        String relationshipGoal
) {
}
