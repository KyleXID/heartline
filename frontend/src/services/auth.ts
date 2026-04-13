import { api } from "./api";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  gender?: string;
  age_range?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nickname: string;
  gender: string | null;
  age_range: string | null;
  is_active: boolean;
}

export const authService = {
  register: (data: RegisterRequest) =>
    api.post<UserResponse>("/auth/register", data),

  login: async (data: LoginRequest) => {
    const tokens = await api.post<TokenResponse>("/auth/login", data);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    return tokens;
  },

  getMe: () => api.get<UserResponse>("/auth/me"),

  refresh: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");
    const tokens = await api.post<TokenResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    return tokens;
  },
};
