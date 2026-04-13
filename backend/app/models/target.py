import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class Target(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "targets"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    nickname: Mapped[str] = mapped_column(String(50))
    memo: Mapped[str | None] = mapped_column(Text)
    relationship_goal: Mapped[str | None] = mapped_column(String(50))

    user: Mapped["User"] = relationship(back_populates="targets")
    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="target",
    )
