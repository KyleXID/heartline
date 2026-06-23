package io.heumlabs.heartline.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** schemas/auth.py 의 TokenRefresh 대응 (refresh_token). */
public record RefreshRequest(
        @NotBlank String refreshToken
) {
}
