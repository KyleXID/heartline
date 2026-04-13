import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register(client: AsyncClient):
    import uuid
    email = f"new-{uuid.uuid4().hex[:8]}@heartline.kr"
    r = await client.post("/api/auth/register", json={
        "email": email,
        "password": "newpass1234",
        "nickname": "신규유저",
    })
    assert r.status_code == 201
    assert r.json()["email"] == email


@pytest.mark.asyncio
async def test_register_duplicate(client: AsyncClient):
    await client.post("/api/auth/register", json={
        "email": "dup@heartline.kr", "password": "pass12345678", "nickname": "중복",
    })
    r = await client.post("/api/auth/register", json={
        "email": "dup@heartline.kr", "password": "pass12345678", "nickname": "중복2",
    })
    assert r.status_code == 409


@pytest.mark.asyncio
async def test_login_and_me(client: AsyncClient, auth_headers: dict):
    r = await client.get("/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["nickname"] == "테스트유저"


@pytest.mark.asyncio
async def test_me_without_auth(client: AsyncClient):
    r = await client.get("/api/auth/me")
    assert r.status_code == 401
