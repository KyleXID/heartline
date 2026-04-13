import uuid
from datetime import datetime

from pydantic import BaseModel


class AnalysisResultResponse(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    interest_score: int
    temperature: float
    emotion_timeline: list | dict
    red_flags: list | dict
    reply_timing_advice: dict
    suggested_replies: list | dict
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalyzeRequest(BaseModel):
    conversation_id: uuid.UUID
