import os
import shutil
from typing import Annotated

from fastapi import APIRouter, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.auth import CurrentUserDep
from app.dependencies import DbDep
from app.models.analysis_result import AnalysisResult
from app.models.conversation import Conversation
from app.models.target import Target
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationImageResponse,
    ConversationResponse,
    ImageUploadResponse,
)
from app.services.conversation import (
    create_conversation,
    get_conversation,
    save_upload_images,
)

router = APIRouter(prefix="/api/conversations", tags=["conversations"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_FILES = 20


@router.get("/", response_model=list[dict])
async def list_conversations(db: DbDep, user: CurrentUserDep) -> list[dict]:
    """사용자의 대화 이력 조회 (분석 결과 포함)."""
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.images))
        .where(Conversation.user_id == user.id)
        .order_by(Conversation.created_at.desc())
    )
    conversations = list(result.scalars().all())

    items = []
    for conv in conversations:
        # 분석 결과 조회
        ar = await db.execute(
            select(AnalysisResult).where(AnalysisResult.conversation_id == conv.id)
        )
        analysis = ar.scalar_one_or_none()

        # 타겟 닉네임 조회
        tr = await db.execute(select(Target).where(Target.id == conv.target_id))
        target = tr.scalar_one_or_none()

        items.append({
            "id": str(conv.id),
            "target_id": str(conv.target_id),
            "target_nickname": target.nickname if target else "알 수 없음",
            "status": conv.status,
            "created_at": conv.created_at.isoformat(),
            "image_count": len(conv.images),
            "interest_score": analysis.interest_score if analysis else None,
            "temperature": analysis.temperature if analysis else None,
        })

    return items


@router.post("/", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create(data: ConversationCreate, db: DbDep, user: CurrentUserDep) -> ConversationResponse:
    conv = await create_conversation(db, user.id, data.target_id)
    return ConversationResponse.model_validate(conv)


@router.post("/{conversation_id}/images", response_model=ImageUploadResponse)
async def upload_images(
    conversation_id: str,
    files: list[UploadFile],
    db: DbDep,
    user: CurrentUserDep,
) -> ImageUploadResponse:
    conv = await get_conversation(db, conversation_id, user.id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다.",
        )

    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"최대 {MAX_FILES}개까지 업로드할 수 있습니다.",
        )

    for file in files:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"지원하지 않는 파일 형식입니다: {file.content_type}",
            )
        if file.size and file.size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="파일 크기는 10MB 이하여야 합니다.",
            )

    start_order = len(conv.images)
    images = await save_upload_images(db, conv.id, files, start_order)

    return ImageUploadResponse(
        uploaded=len(images),
        images=[ConversationImageResponse.model_validate(img) for img in images],
    )


@router.delete("/{conversation_id}/images")
async def delete_images(
    conversation_id: str,
    db: DbDep,
    user: CurrentUserDep,
) -> dict:
    """분석 완료 후 대화 이미지 물리 삭제 (개인정보 보호)."""
    conv = await get_conversation(db, conversation_id, user.id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다.",
        )

    # 물리 파일 삭제
    upload_dir = f"uploads/conversations/{conversation_id}"
    if os.path.exists(upload_dir):
        shutil.rmtree(upload_dir)

    # DB에서 image_file 필드 null 처리 (ocr_text는 보존)
    for img in conv.images:
        img.image_file = None
    await db.commit()

    return {"deleted": len(conv.images), "message": "이미지가 삭제되었습니다."}


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get(conversation_id: str, db: DbDep, user: CurrentUserDep) -> ConversationResponse:
    conv = await get_conversation(db, conversation_id, user.id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다.",
        )
    return ConversationResponse.model_validate(conv)
