import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_kakao_login_url(client: AsyncClient):
    """카카오 로그인 URL이 올바르게 반환되는지 확인.

    KAKAO_CLIENT_ID가 설정되지 않은 테스트 환경에서는 503,
    설정된 환경에서는 200 + URL 반환.
    """
    response = await client.get("/api/oauth/kakao/login-url")
    assert response.status_code in (200, 503)

    if response.status_code == 200:
        data = response.json()
        assert "url" in data
        assert "kauth.kakao.com" in data["url"]
    else:
        assert "카카오 로그인이 설정되지 않았습니다" in response.json()["detail"]


@pytest.mark.asyncio
async def test_kakao_callback_invalid_code(client: AsyncClient):
    """유효하지 않은 인가 코드로 콜백 시 401 반환."""
    response = await client.post(
        "/api/oauth/kakao/callback", json={"code": "invalid_code"}
    )
    assert response.status_code == 401
    assert "카카오 인증에 실패했습니다" in response.json()["detail"]


@pytest.mark.asyncio
async def test_kakao_callback_missing_code(client: AsyncClient):
    """인가 코드 없이 콜백 요청 시 422 반환."""
    response = await client.post("/api/oauth/kakao/callback", json={})
    assert response.status_code == 422
