"""Redis 기반 분석 결과 캐싱."""

import json

import redis.asyncio as redis

from app.config import settings

_redis: redis.Redis | None = None

CACHE_TTL = 60 * 60 * 24  # 24시간


async def get_redis() -> redis.Redis:
    global _redis
    if _redis is None:
        _redis = redis.from_url(settings.redis_url, decode_responses=True)
    return _redis


def _cache_key(conversation_id: str) -> str:
    return f"analysis:{conversation_id}"


async def get_cached_analysis(conversation_id: str) -> dict | None:
    r = await get_redis()
    data = await r.get(_cache_key(conversation_id))
    if data:
        return json.loads(data)
    return None


async def set_cached_analysis(conversation_id: str, data: dict) -> None:
    r = await get_redis()
    await r.set(_cache_key(conversation_id), json.dumps(data, default=str), ex=CACHE_TTL)


async def invalidate_analysis_cache(conversation_id: str) -> None:
    r = await get_redis()
    await r.delete(_cache_key(conversation_id))
