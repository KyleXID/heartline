import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class ConversationImage(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "conversation_images"

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("conversations.id"),
    )
    image_file: Mapped[str] = mapped_column(String(500))
    order: Mapped[int] = mapped_column(Integer, default=0)
    ocr_text: Mapped[str | None] = mapped_column(Text)

    conversation: Mapped["Conversation"] = relationship(
        back_populates="images",
    )
