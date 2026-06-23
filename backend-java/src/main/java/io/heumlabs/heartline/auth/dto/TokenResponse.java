package io.heumlabs.heartline.auth.dto;

/** schemas/auth.py 의 TokenResponse 대응 (access_token, refresh_token, token_type). */
public record TokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType
) {
    public static TokenResponse of(String accessToken, String refreshToken) {
        return new TokenResponse(accessToken, refreshToken, "bearer");
    }
}
