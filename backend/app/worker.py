"""ARQ worker 설정 및 작업 정의.

실행: uv run arq backend.app.worker.WorkerSettings
"""

from arq.connections import RedisSettings

from app.config import settings


async def startup(ctx: dict) -> None:
    from app.database import async_session
    ctx["db_session_factory"] = async_session


async def shutdown(ctx: dict) -> None:
    pass


async def process_ocr(ctx: dict, conversation_id: str) -> dict:
    """OCR 처리 작업 (HL-11에서 구현 예정)."""
    return {"conversation_id": conversation_id, "status": "pending_implementation"}


class WorkerSettings:
    functions = [process_ocr]
    on_startup = startup
    on_shutdown = shutdown
    redis_settings = RedisSettings.from_dsn(settings.redis_url)
    max_jobs = 5
    job_timeout = 300
