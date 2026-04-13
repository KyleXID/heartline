import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class TargetCreate(BaseModel):
    nickname: str = Field(min_length=1, max_length=50)
    memo: str | None = None
    relationship_goal: str | None = Field(
        default=None,
        description="썸→고백, 재회, 관계발전, 유지, 기타",
    )


class TargetUpdate(BaseModel):
    nickname: str | None = Field(default=None, min_length=1, max_length=50)
    memo: str | None = None
    relationship_goal: str | None = None


class TargetResponse(BaseModel):
    id: uuid.UUID
    nickname: str
    memo: str | None
    relationship_goal: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
