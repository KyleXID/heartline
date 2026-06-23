package io.heumlabs.heartline.oauth;

import io.heumlabs.heartline.auth.dto.TokenResponse;
import io.heumlabs.heartline.oauth.dto.KakaoCallbackRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** api/oauth.py 의 라우터 대응. */
@RestController
@RequestMapping("/api/oauth")
public class KakaoOAuthController {

    private final KakaoOAuthService kakaoOAuthService;

    public KakaoOAuthController(KakaoOAuthService kakaoOAuthService) {
        this.kakaoOAuthService = kakaoOAuthService;
    }

    @GetMapping("/kakao/login-url")
    public Map<String, String> loginUrl() {
        return Map.of("url", kakaoOAuthService.loginUrl());
    }

    @PostMapping("/kakao/callback")
    public TokenResponse callback(@Valid @RequestBody KakaoCallbackRequest request) {
        return kakaoOAuthService.login(request.code());
    }
}
