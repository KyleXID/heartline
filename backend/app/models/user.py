from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    nickname: Mapped[str] = mapped_column(String(50))
    hashed_password: Mapped[str | None] = mapped_column(String(255))
    gender: Mapped[str | None] = mapped_column(String(10))
    age_range: Mapped[str | None] = mapped_column(String(10))
    kakao_oauth_id: Mapped[str | None] = mapped_column(
        String(255), unique=True, index=True,
    )
    is_active: Mapped[bool] = mapped_column(default=True)

    targets: Mapped[list["Target"]] = relationship(back_populates="user")
    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="user",
    )
