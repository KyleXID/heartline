import asyncio
from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text

from app.database import async_session, engine
from app.main import app


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    await engine.dispose()


@pytest_asyncio.fixture(autouse=True)
async def cleanup_db():
    """각 테스트 후 DB를 자동 정리."""
    yield
    async with async_session() as db:
        await db.execute(text("DELETE FROM analysis_results"))
        await db.execute(text("DELETE FROM messages"))
        await db.execute(text("DELETE FROM conversation_images"))
        await db.execute(text("DELETE FROM conversations"))
        await db.execute(text("DELETE FROM targets"))
        await db.execute(text("DELETE FROM users"))
        await db.commit()


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient) -> dict[str, str]:
    await client.post("/api/auth/register", json={
        "email": "testuser@heartline.kr",
        "password": "testpass1234",
        "nickname": "테스트유저",
    })
    r = await client.post("/api/auth/login", json={
        "email": "testuser@heartline.kr",
        "password": "testpass1234",
    })
    tokens = r.json()
    return {"Authorization": f"Bearer {tokens['access_token']}"}
