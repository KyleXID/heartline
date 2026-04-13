from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select

from app.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.database import async_session
from app.models.user import User
from app.schemas.auth import TokenResponse
from app.services.kakao import extract_kakao_profile, get_kakao_token, get_kakao_user

router = APIRouter(prefix="/api/oauth", tags=["oauth"])


class KakaoCallbackRequest(BaseModel):
    code: str


@router.get("/kakao/login-url")
async def kakao_login_url() -> dict[str, str]:
    """프론트엔드에서 사용할 카카오 로그인 URL 반환."""
    if not settings.kakao_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="카카오 로그인이 설정되지 않았습니다.",
        )
    url = (
        f"https://kauth.kakao.com/oauth/authorize"
        f"?client_id={settings.kakao_client_id}"
        f"&redirect_uri={settings.kakao_redirect_uri}"
        f"&response_type=code"
        f"&scope=profile_nickname,account_email"
    )
    return {"url": url}


@router.post("/kakao/callback", response_model=TokenResponse)
async def kakao_callback(data: KakaoCallbackRequest) -> TokenResponse:
    """카카오 인가 코드로 로그인/회원가입 처리."""
    try:
        token_data = await get_kakao_token(data.code)
        kakao_user = await get_kakao_user(token_data["access_token"])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="카카오 인증에 실패했습니다.",
        )

    profile = extract_kakao_profile(kakao_user)

    async with async_session() as db:
        # 기존 카카오 유저 조회
        result = await db.execute(
            select(User).where(User.kakao_oauth_id == profile["kakao_oauth_id"])
        )
        user = result.scalar_one_or_none()

        if not user and profile.get("email"):
            # 같은 이메일 유저가 있으면 카카오 연동
            result = await db.execute(
                select(User).where(User.email == profile["email"])
            )
            user = result.scalar_one_or_none()
            if user:
                user.kakao_oauth_id = profile["kakao_oauth_id"]
                await db.commit()

        if not user:
            # 신규 가입
            user = User(
                email=profile.get("email") or f"{profile['kakao_oauth_id']}@kakao.heartline",
                nickname=profile["nickname"],
                kakao_oauth_id=profile["kakao_oauth_id"],
                gender=profile.get("gender"),
                age_range=profile.get("age_range"),
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(subject=str(user.id)),
        refresh_token=create_refresh_token(subject=str(user.id)),
    )
