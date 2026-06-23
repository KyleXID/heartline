package io.heumlabs.heartline.oauth.dto;

/** services/kakao.py 의 extract_kakao_profile 결과 대응. */
public record KakaoProfile(
        String kakaoOauthId,
        String email,
        String nickname,
        String gender,
        String ageRange
) {
}
