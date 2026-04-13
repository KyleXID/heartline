"""카카오 OAuth 서비스."""

import httpx

from app.config import settings

KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token"
KAKAO_USER_URL = "https://kapi.kakao.com/v2/user/me"


async def get_kakao_token(code: str) -> dict:
    """인가 코드로 카카오 access token 발급."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            KAKAO_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "client_id": settings.kakao_client_id,
                "client_secret": settings.kakao_client_secret,
                "redirect_uri": settings.kakao_redirect_uri,
                "code": code,
            },
        )
        response.raise_for_status()
        return response.json()


async def get_kakao_user(access_token: str) -> dict:
    """카카오 access token으로 사용자 정보 조회."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            KAKAO_USER_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        return response.json()


def extract_kakao_profile(kakao_user: dict) -> dict:
    """카카오 API 응답에서 프로필 정보 추출."""
    kakao_id = str(kakao_user["id"])
    account = kakao_user.get("kakao_account", {})
    profile = account.get("profile", {})

    return {
        "kakao_oauth_id": kakao_id,
        "email": account.get("email"),
        "nickname": profile.get("nickname", f"user_{kakao_id[:8]}"),
        "gender": account.get("gender"),
        "age_range": account.get("age_range"),
    }
