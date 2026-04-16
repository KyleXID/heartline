import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_analyze_nonexistent_conversation(client: AsyncClient, auth_headers: dict):
    """존재하지 않는 대화 분석 요청 시 404."""
    resp = await client.post(
        "/api/analysis/",
        json={"conversation_id": "00000000-0000-0000-0000-000000000000"},
        headers=auth_headers,
    )
    assert resp.status_code == 404
    assert "대화를 찾을 수 없습니다" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_get_analysis_not_found(client: AsyncClient, auth_headers: dict):
    """분석 결과가 없는 대화 조회 시 404."""
    resp = await client.get(
        "/api/analysis/00000000-0000-0000-0000-000000000000",
        headers=auth_headers,
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_analyze_unauthenticated(client: AsyncClient):
    """인증 없이 분석 요청 시 401."""
    resp = await client.post(
        "/api/analysis/",
        json={"conversation_id": "00000000-0000-0000-0000-000000000000"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_analysis_unauthenticated(client: AsyncClient):
    """인증 없이 분석 결과 조회 시 401."""
    resp = await client.get(
        "/api/analysis/00000000-0000-0000-0000-000000000000",
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_analyze_own_conversation_no_messages(
    client: AsyncClient, auth_headers: dict,
):
    """자신의 대화지만 메시지가 없는 경우 분석 시 에러 (400 또는 502)."""
    # target 생성
    target_resp = await client.post(
        "/api/targets/",
        json={"nickname": "분석테스트"},
        headers=auth_headers,
    )
    target_id = target_resp.json()["id"]

    # conversation 생성 (이미지/메시지 없음)
    conv_resp = await client.post(
        "/api/conversations/",
        json={"target_id": target_id},
        headers=auth_headers,
    )
    conv_id = conv_resp.json()["id"]

    # 메시지 없는 대화 분석 시도
    resp = await client.post(
        "/api/analysis/",
        json={"conversation_id": conv_id},
        headers=auth_headers,
    )
    # 메시지가 없으면 400 (ValueError) 또는 502 (AI 분석 실패) 예상
    assert resp.status_code in (400, 502)
