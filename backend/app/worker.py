"""ARQ worker 설정 및 작업 정의.

실행: uv run arq backend.app.worker.WorkerSettings
"""

import uuid

from arq.connections import RedisSettings
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.config import settings


async def startup(ctx: dict) -> None:
    from app.database import async_session
    ctx["db_session_factory"] = async_session


async def shutdown(ctx: dict) -> None:
    pass


async def process_ocr(ctx: dict, conversation_id: str) -> dict:
    """대화 이미지들에 OCR을 수행하고 결과를 DB에 저장."""
    from app.models.conversation import Conversation
    from app.services.ocr import run_ocr_pipeline

    db_factory = ctx["db_session_factory"]
    async with db_factory() as db:
        result = await db.execute(
            select(Conversation)
            .options(selectinload(Conversation.images))
            .where(Conversation.id == uuid.UUID(conversation_id))
        )
        conv = result.scalar_one_or_none()
        if not conv:
            return {"error": "conversation not found"}

        conv.status = "processing"
        await db.commit()

        image_paths = [img.image_file for img in sorted(conv.images, key=lambda x: x.order)]
        ocr_results = run_ocr_pipeline(image_paths)

        for img in conv.images:
            for ocr in ocr_results:
                if ocr["image_path"] == img.image_file:
                    img.ocr_text = ocr["ocr_text"]
                    break

        conv.status = "ocr_complete"
        await db.commit()

    return {"conversation_id": conversation_id, "status": "ocr_complete", "images_processed": len(ocr_results)}


class WorkerSettings:
    functions = [process_ocr]
    on_startup = startup
    on_shutdown = shutdown
    redis_settings = RedisSettings.from_dsn(settings.redis_url)
    max_jobs = 5
    job_timeout = 300
