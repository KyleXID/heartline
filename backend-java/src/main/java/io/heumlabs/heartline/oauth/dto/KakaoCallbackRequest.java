package io.heumlabs.heartline.oauth.dto;

import jakarta.validation.constraints.NotBlank;

/** api/oauth.py 의 KakaoCallbackRequest 대응. */
public record KakaoCallbackRequest(
        @NotBlank String code
) {
}
