import uuid
from pathlib import Path

import aiofiles
from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.conversation import Conversation
from app.models.conversation_image import ConversationImage

UPLOAD_DIR = Path("uploads/conversations")


async def create_conversation(
    db: AsyncSession, user_id: uuid.UUID, target_id: uuid.UUID,
) -> Conversation:
    conv = Conversation(user_id=user_id, target_id=target_id, status="pending")
    db.add(conv)
    await db.commit()
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.images))
        .where(Conversation.id == conv.id)
    )
    return result.scalar_one()


async def get_conversation(
    db: AsyncSession, conversation_id: uuid.UUID, user_id: uuid.UUID,
) -> Conversation | None:
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.images))
        .where(Conversation.id == conversation_id, Conversation.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def save_upload_images(
    db: AsyncSession,
    conversation_id: uuid.UUID,
    files: list[UploadFile],
    start_order: int = 0,
) -> list[ConversationImage]:
    conv_dir = UPLOAD_DIR / str(conversation_id)
    conv_dir.mkdir(parents=True, exist_ok=True)

    images = []
    for i, file in enumerate(files):
        ext = Path(file.filename or "image.png").suffix
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = conv_dir / filename

        async with aiofiles.open(filepath, "wb") as f:
            content = await file.read()
            await f.write(content)

        image = ConversationImage(
            conversation_id=conversation_id,
            image_file=str(filepath),
            order=start_order + i,
        )
        db.add(image)
        images.append(image)

    await db.commit()
    for img in images:
        await db.refresh(img)

    return images
