import uuid
from datetime import datetime

from pydantic import BaseModel


class ConversationCreate(BaseModel):
    target_id: uuid.UUID


class ConversationImageResponse(BaseModel):
    id: uuid.UUID
    image_file: str
    order: int
    ocr_text: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    target_id: uuid.UUID
    status: str
    created_at: datetime
    images: list[ConversationImageResponse] = []

    model_config = {"from_attributes": True}


class ImageUploadResponse(BaseModel):
    uploaded: int
    images: list[ConversationImageResponse]
