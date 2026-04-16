import { api } from "./api";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const oauthService = {
  getKakaoLoginUrl: () => api.get<{ url: string }>("/oauth/kakao/login-url"),

  kakaoCallback: async (code: string) => {
    const tokens = await api.post<TokenResponse>("/oauth/kakao/callback", {
      code,
    });
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    return tokens;
  },
};
