package io.heumlabs.heartline.oauth;

import io.heumlabs.heartline.config.KakaoProperties;
import io.heumlabs.heartline.oauth.dto.KakaoProfile;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/** services/kakao.py 대응. 카카오 토큰/사용자 조회 외부 호출. */
@Component
public class KakaoApiClient {

    private static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String USER_URL = "https://kapi.kakao.com/v2/user/me";
    private static final ParameterizedTypeReference<Map<String, Object>> MAP_TYPE =
            new ParameterizedTypeReference<>() {
            };

    private final RestClient restClient;
    private final KakaoProperties properties;

    public KakaoApiClient(KakaoProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.create();
    }

    /** 인가 코드로 카카오 access token 발급. */
    public String getAccessToken(String code) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", properties.clientId());
        form.add("client_secret", properties.clientSecret());
        form.add("redirect_uri", properties.redirectUri());
        form.add("code", code);

        Map<String, Object> response = restClient.post()
                .uri(TOKEN_URL)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(MAP_TYPE);

        if (response == null || response.get("access_token") == null) {
            throw new IllegalStateException("카카오 토큰 응답이 비어있습니다.");
        }
        return String.valueOf(response.get("access_token"));
    }

    /** access token 으로 사용자 정보 조회. */
    public Map<String, Object> getUser(String accessToken) {
        return restClient.get()
                .uri(USER_URL)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(MAP_TYPE);
    }

    /** 카카오 API 응답에서 프로필 추출. */
    @SuppressWarnings("unchecked")
    public KakaoProfile extractProfile(Map<String, Object> kakaoUser) {
        String kakaoId = String.valueOf(kakaoUser.get("id"));
        Map<String, Object> account =
                (Map<String, Object>) kakaoUser.getOrDefault("kakao_account", Map.of());
        Map<String, Object> profile =
                (Map<String, Object>) account.getOrDefault("profile", Map.of());

        String nickname = (String) profile.get("nickname");
        if (nickname == null) {
            nickname = "user_" + kakaoId.substring(0, Math.min(8, kakaoId.length()));
        }

        return new KakaoProfile(
                kakaoId,
                (String) account.get("email"),
                nickname,
                (String) account.get("gender"),
                (String) account.get("age_range"));
    }
}
