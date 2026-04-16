import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_conversation(client: AsyncClient, auth_headers: dict):
    """대화 생성 테스트 - target 생성 후 conversation 생성."""
    # target 생성
    target_resp = await client.post(
        "/api/targets/",
        json={"nickname": "대화테스트상대", "relationship_goal": "연인"},
        headers=auth_headers,
    )
    assert target_resp.status_code == 201
    target_id = target_resp.json()["id"]

    # conversation 생성
    resp = await client.post(
        "/api/conversations/",
        json={"target_id": target_id},
        headers=auth_headers,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "pending"
    assert data["target_id"] == target_id


@pytest.mark.asyncio
async def test_list_conversations(client: AsyncClient, auth_headers: dict):
    """대화 목록 조회 테스트."""
    resp = await client.get("/api/conversations/", headers=auth_headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_list_conversations_with_data(client: AsyncClient, auth_headers: dict):
    """대화 생성 후 목록에 나타나는지 확인."""
    # target + conversation 생성
    target_resp = await client.post(
        "/api/targets/",
        json={"nickname": "목록테스트"},
        headers=auth_headers,
    )
    target_id = target_resp.json()["id"]
    await client.post(
        "/api/conversations/",
        json={"target_id": target_id},
        headers=auth_headers,
    )

    resp = await client.get("/api/conversations/", headers=auth_headers)
    assert resp.status_code == 200
    items = resp.json()
    assert len(items) >= 1
    assert items[0]["target_nickname"] == "목록테스트"


@pytest.mark.asyncio
async def test_get_conversation(client: AsyncClient, auth_headers: dict):
    """개별 대화 조회 테스트."""
    # target + conversation 생성
    target_resp = await client.post(
        "/api/targets/",
        json={"nickname": "조회테스트"},
        headers=auth_headers,
    )
    target_id = target_resp.json()["id"]
    conv_resp = await client.post(
        "/api/conversations/",
        json={"target_id": target_id},
        headers=auth_headers,
    )
    conv_id = conv_resp.json()["id"]

    resp = await client.get(
        f"/api/conversations/{conv_id}", headers=auth_headers
    )
    assert resp.status_code == 200
    assert resp.json()["id"] == conv_id


@pytest.mark.asyncio
async def test_get_conversation_not_found(client: AsyncClient, auth_headers: dict):
    """존재하지 않는 대화 조회 시 404."""
    resp = await client.get(
        "/api/conversations/00000000-0000-0000-0000-000000000000",
        headers=auth_headers,
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_create_conversation_invalid_target(client: AsyncClient, auth_headers: dict):
    """존재하지 않는 target으로 대화 생성 시 에러."""
    resp = await client.post(
        "/api/conversations/",
        json={"target_id": "00000000-0000-0000-0000-000000000000"},
        headers=auth_headers,
    )
    # target이 없으면 에러 반환 (400, 404, 또는 500 중 하나)
    assert resp.status_code >= 400


@pytest.mark.asyncio
async def test_list_conversations_unauthenticated(client: AsyncClient):
    """인증 없이 대화 목록 조회 시 401."""
    resp = await client.get("/api/conversations/")
    assert resp.status_code == 401
