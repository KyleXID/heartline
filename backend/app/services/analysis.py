"""Gemini API 기반 대화 분석 엔진.

관심도, 온도, 감정 흐름, 답장 타이밍, 답장 문구, Red Flag을 한 번의 API 호출로 분석.
"""

import json
import uuid

from google import genai
from google.genai.types import GenerateContentConfig
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.analysis_result import AnalysisResult
from app.models.conversation import Conversation
from app.models.message import Message

ANALYSIS_PROMPT = """당신은 연애 전문 상담사입니다. 아래 카카오톡 대화를 분석해주세요.

## 대화 참여자
- "나": 사용자 (코칭 대상)
- "상대": 상대방 (분석 대상)
- 관계 목표: {relationship_goal}

## 대화 내용
{conversation_text}

## 분석 요청
다음 JSON 형식으로 정확히 응답해주세요. 다른 텍스트 없이 JSON만 출력:

{{
  "interest_score": 0~100 사이 정수 (상대방의 관심도. 0=무관심, 100=매우 높은 관심),
  "temperature": 0.0~100.0 사이 실수 (대화 분위기 온도. 0=차가움, 100=뜨거움),
  "emotion_timeline": [
    {{"phase": "초반/중반/후반", "emotion": "감정 키워드", "intensity": 0~10}}
  ],
  "red_flags": [
    {{"type": "읽씹/관심하락/회피/거리두기 등", "description": "구체적 설명", "severity": "low/medium/high"}}
  ],
  "reply_timing": {{
    "recommendation": "지금 바로/30분 후/1시간 후/내일 오전/내일 저녁 중 선택",
    "reason": "추천 이유"
  }},
  "suggested_replies": [
    {{"tone": "가벼운", "message": "추천 답장 문구", "explanation": "이 톤을 추천하는 이유"}},
    {{"tone": "진지한", "message": "추천 답장 문구", "explanation": "이 톤을 추천하는 이유"}},
    {{"tone": "재치있는", "message": "추천 답장 문구", "explanation": "이 톤을 추천하는 이유"}}
  ],
  "summary": "2~3문장 종합 분석 코멘트 (한국어)"
}}
"""


def _get_client() -> genai.Client:
    return genai.Client(api_key=settings.gemini_api_key)


def _format_messages(messages: list[Message]) -> str:
    lines = []
    for msg in sorted(messages, key=lambda m: m.sent_at or m.created_at):
        sender = "나" if msg.sender_type == "me" else "상대"
        time_str = msg.sent_at.strftime("%H:%M") if msg.sent_at else ""
        lines.append(f"[{sender}] {time_str} {msg.content}")
    return "\n".join(lines)


async def run_analysis(
    db: AsyncSession,
    conversation_id: uuid.UUID,
) -> AnalysisResult:
    """대화 분석 실행 및 결과 저장."""
    conv_result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conv = conv_result.scalar_one()

    msg_result = await db.execute(
        select(Message).where(Message.conversation_id == conversation_id)
    )
    messages = list(msg_result.scalars().all())

    if not messages:
        raise ValueError("분석할 메시지가 없습니다.")

    from app.models.target import Target
    target_result = await db.execute(
        select(Target).where(Target.id == conv.target_id)
    )
    target = target_result.scalar_one_or_none()
    goal = target.relationship_goal if target else "미설정"

    conversation_text = _format_messages(messages)
    prompt = ANALYSIS_PROMPT.format(
        relationship_goal=goal,
        conversation_text=conversation_text,
    )

    client = _get_client()
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.7,
        ),
    )

    data = json.loads(response.text)

    existing = await db.execute(
        select(AnalysisResult).where(AnalysisResult.conversation_id == conversation_id)
    )
    result = existing.scalar_one_or_none()

    if result:
        result.interest_score = data["interest_score"]
        result.temperature = data["temperature"]
        result.emotion_timeline = data.get("emotion_timeline", [])
        result.red_flags = data.get("red_flags", [])
        result.reply_timing_advice = data.get("reply_timing", {})
        result.suggested_replies = data.get("suggested_replies", [])
    else:
        result = AnalysisResult(
            conversation_id=conversation_id,
            interest_score=data["interest_score"],
            temperature=data["temperature"],
            emotion_timeline=data.get("emotion_timeline", []),
            red_flags=data.get("red_flags", []),
            reply_timing_advice=data.get("reply_timing", {}),
            suggested_replies=data.get("suggested_replies", []),
        )
        db.add(result)

    conv.status = "analyzed"
    await db.commit()
    await db.refresh(result)

    return result
