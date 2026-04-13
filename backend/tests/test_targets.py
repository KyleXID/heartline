import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_target_crud(client: AsyncClient, auth_headers: dict):
    # Create
    r = await client.post("/api/targets/", json={
        "nickname": "테스트상대", "relationship_goal": "썸→고백",
    }, headers=auth_headers)
    assert r.status_code == 201
    tid = r.json()["id"]

    # List
    r = await client.get("/api/targets/", headers=auth_headers)
    assert r.status_code == 200
    assert len(r.json()) >= 1

    # Update
    r = await client.patch(f"/api/targets/{tid}", json={"memo": "메모"}, headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["memo"] == "메모"

    # Delete
    r = await client.delete(f"/api/targets/{tid}", headers=auth_headers)
    assert r.status_code == 204
