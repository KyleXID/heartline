"""카카오톡 OCR 텍스트를 개별 메시지로 파싱.

카카오톡 스크린샷 OCR 결과는 대체로 이런 형태:
- "닉네임 오후 3:42" → 발화자 + 시간
- "메시지 내용" → 메시지 본문
- 왼쪽 말풍선 = 상대방, 오른쪽 말풍선 = 나
  (OCR에서 위치 정보는 없으므로 닉네임 기반으로 구분)
"""

import re
import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.message import Message

# 카카오톡 시간 패턴: "오전/오후 HH:MM" 또는 "AM/PM HH:MM"
TIME_PATTERN = re.compile(
    r"(오전|오후|AM|PM)\s*(\d{1,2}):(\d{2})"
)

# 발화자 + 시간 패턴: "닉네임 오전 10:30" 또는 "닉네임 오후 3:42"
SENDER_LINE_PATTERN = re.compile(
    r"^(.+?)\s+(오전|오후|AM|PM)\s*(\d{1,2}):(\d{2})\s*$"
)


def parse_kakao_time(period: str, hour: int, minute: int) -> datetime:
    """카카오톡 시간 표기를 datetime으로 변환."""
    if period in ("오후", "PM") and hour != 12:
        hour += 12
    elif period in ("오전", "AM") and hour == 12:
        hour = 0
    return datetime.now(timezone.utc).replace(
        hour=hour, minute=minute, second=0, microsecond=0,
    )


def parse_ocr_text(ocr_text: str, my_nickname: str | None = None) -> list[dict]:
    """OCR 텍스트를 메시지 리스트로 파싱.

    Args:
        ocr_text: OCR로 추출된 텍스트 (줄바꿈으로 구분)
        my_nickname: 사용자의 닉네임 (None이면 발화자 구분 불가 → "unknown")

    Returns:
        [{"sender_type": "me"|"other"|"unknown", "content": str, "sent_at": datetime|None}]
    """
    lines = [line.strip() for line in ocr_text.split("\n") if line.strip()]
    messages = []
    current_sender = "unknown"
    current_time = None
    buffer = []

    for line in lines:
        # 시스템 메시지 건너뛰기 (날짜 구분선 등)
        if re.match(r"^\d{4}년\s*\d{1,2}월\s*\d{1,2}일", line):
            continue
        if "님이 들어왔습니다" in line or "님이 나갔습니다" in line:
            continue

        # 발화자 + 시간 패턴 매칭
        match = SENDER_LINE_PATTERN.match(line)
        if match:
            # 이전 버퍼 플러시
            if buffer:
                messages.append({
                    "sender_type": current_sender,
                    "content": "\n".join(buffer),
                    "sent_at": current_time,
                })
                buffer = []

            nickname = match.group(1).strip()
            period = match.group(2)
            hour = int(match.group(3))
            minute = int(match.group(4))

            current_time = parse_kakao_time(period, hour, minute)

            if my_nickname and nickname == my_nickname:
                current_sender = "me"
            elif my_nickname:
                current_sender = "other"
            else:
                current_sender = "unknown"
        else:
            # 메시지 본문
            buffer.append(line)

    # 마지막 버퍼 플러시
    if buffer:
        messages.append({
            "sender_type": current_sender,
            "content": "\n".join(buffer),
            "sent_at": current_time,
        })

    return messages


async def save_parsed_messages(
    db: AsyncSession,
    conversation_id: uuid.UUID,
    parsed_messages: list[dict],
) -> list[Message]:
    """파싱된 메시지를 DB에 저장."""
    db_messages = []
    for msg in parsed_messages:
        m = Message(
            conversation_id=conversation_id,
            sender_type=msg["sender_type"],
            content=msg["content"],
            sent_at=msg.get("sent_at"),
        )
        db.add(m)
        db_messages.append(m)

    await db.commit()
    for m in db_messages:
        await db.refresh(m)

    return db_messages
