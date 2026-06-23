package io.heumlabs.heartline.oauth;

import io.heumlabs.heartline.auth.AuthService;
import io.heumlabs.heartline.auth.dto.TokenResponse;
import io.heumlabs.heartline.common.exception.ApiException;
import io.heumlabs.heartline.config.KakaoProperties;
import io.heumlabs.heartline.domain.User;
import io.heumlabs.heartline.oauth.dto.KakaoProfile;
import io.heumlabs.heartline.repository.UserRepository;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

/** api/oauth.py 의 로그인/연동/가입 로직 대응. */
@Service
public class KakaoOAuthService {

    private final KakaoApiClient kakaoApiClient;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final KakaoProperties properties;

    public KakaoOAuthService(KakaoApiClient kakaoApiClient, UserRepository userRepository,
            AuthService authService, KakaoProperties properties) {
        this.kakaoApiClient = kakaoApiClient;
        this.userRepository = userRepository;
        this.authService = authService;
        this.properties = properties;
    }

    /** 프론트엔드에서 사용할 카카오 로그인 URL. */
    public String loginUrl() {
        if (properties.clientId() == null || properties.clientId().isBlank()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "카카오 로그인이 설정되지 않았습니다.");
        }
        // redirect_uri 등 쿼리 파라미터는 퍼센트 인코딩이 필요하므로 UriComponentsBuilder 사용.
        return UriComponentsBuilder.fromUriString("https://kauth.kakao.com/oauth/authorize")
                .queryParam("client_id", properties.clientId())
                .queryParam("redirect_uri", properties.redirectUri())
                .queryParam("response_type", "code")
                .queryParam("scope", "profile_nickname,account_email")
                .encode()
                .toUriString();
    }

    /** 인가 코드로 로그인/회원가입 처리. */
    @Transactional
    public TokenResponse login(String code) {
        KakaoProfile profile;
        try {
            String accessToken = kakaoApiClient.getAccessToken(code);
            Map<String, Object> kakaoUser = kakaoApiClient.getUser(accessToken);
            profile = kakaoApiClient.extractProfile(kakaoUser);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "카카오 인증에 실패했습니다.");
        }

        // 1) 기존 카카오 유저
        User user = userRepository.findByKakaoOauthId(profile.kakaoOauthId()).orElse(null);

        // 2) 같은 이메일 유저가 있으면 카카오 연동 (dirty checking 으로 저장)
        if (user == null && profile.email() != null) {
            User existing = userRepository.findByEmail(profile.email()).orElse(null);
            if (existing != null) {
                existing.setKakaoOauthId(profile.kakaoOauthId());
                user = existing;
            }
        }

        // 3) 신규 가입
        if (user == null) {
            String email = profile.email() != null
                    ? profile.email()
                    : profile.kakaoOauthId() + "@kakao.heartline";
            user = userRepository.save(User.builder()
                    .email(email)
                    .nickname(profile.nickname())
                    .kakaoOauthId(profile.kakaoOauthId())
                    .gender(profile.gender())
                    .ageRange(profile.ageRange())
                    .build());
        }

        return authService.issueTokens(user);
    }
}
