import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class Conversation(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "conversations"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    target_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("targets.id"))
    status: Mapped[str] = mapped_column(String(20), default="pending")

    user: Mapped["User"] = relationship(back_populates="conversations")
    target: Mapped["Target"] = relationship(back_populates="conversations")
    images: Mapped[list["ConversationImage"]] = relationship(
        back_populates="conversation",
    )
    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation",
    )
    analysis_result: Mapped["AnalysisResult | None"] = relationship(
        back_populates="conversation",
    )
