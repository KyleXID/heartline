package io.heumlabs.heartline.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.heumlabs.heartline.domain.User;
import java.util.UUID;

/** schemas/auth.py 의 UserResponse 대응 (id, email, nickname, gender, age_range, is_active). */
public record UserResponse(
        UUID id,
        String email,
        String nickname,
        String gender,
        String ageRange,
        // boolean is-prefix 규약/Jackson 버전과 무관하게 JSON 키를 is_active 로 확정.
        @JsonProperty("is_active") boolean active
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getGender(),
                user.getAgeRange(),
                user.isActive()
        );
    }
}
