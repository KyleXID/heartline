import uuid

from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class AnalysisResult(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "analysis_results"

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("conversations.id"),
        unique=True,
    )
    interest_score: Mapped[int] = mapped_column(Integer)  # 0-100
    temperature: Mapped[float] = mapped_column(Float)
    emotion_timeline: Mapped[dict] = mapped_column(JSONB, default=dict)
    red_flags: Mapped[dict] = mapped_column(JSONB, default=dict)
    reply_timing_advice: Mapped[dict] = mapped_column(JSONB, default=dict)
    suggested_replies: Mapped[dict] = mapped_column(JSONB, default=dict)

    conversation: Mapped["Conversation"] = relationship(
        back_populates="analysis_result",
    )
