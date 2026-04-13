from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.auth import CurrentUserDep
from app.core.cache import get_cached_analysis, set_cached_analysis, invalidate_analysis_cache
from app.dependencies import DbDep
from app.models.analysis_result import AnalysisResult
from app.models.conversation import Conversation
from app.schemas.analysis import AnalysisResultResponse, AnalyzeRequest
from app.services.analysis import run_analysis

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("/", response_model=AnalysisResultResponse)
async def analyze_conversation(
    data: AnalyzeRequest, db: DbDep, user: CurrentUserDep,
) -> AnalysisResult:
    # 소유자 확인
    conv_result = await db.execute(
        select(Conversation).where(
            Conversation.id == data.conversation_id,
            Conversation.user_id == user.id,
        )
    )
    if not conv_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다.",
        )

    # 재분석 시 캐시 무효화
    await invalidate_analysis_cache(str(data.conversation_id))

    try:
        result = await run_analysis(db, data.conversation_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        )

    # 캐시 저장
    await set_cached_analysis(
        str(data.conversation_id),
        AnalysisResultResponse.model_validate(result).model_dump(),
    )

    return result


@router.get("/{conversation_id}", response_model=AnalysisResultResponse)
async def get_analysis(
    conversation_id: str, db: DbDep, user: CurrentUserDep,
) -> AnalysisResult:
    # 소유자 확인
    conv_result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user.id,
        )
    )
    if not conv_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다.",
        )

    # 캐시 확인
    cached = await get_cached_analysis(conversation_id)
    if cached:
        return AnalysisResultResponse(**cached)

    result = await db.execute(
        select(AnalysisResult).where(AnalysisResult.conversation_id == conversation_id)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="분석 결과가 아직 없습니다.",
        )

    # 캐시에 저장
    await set_cached_analysis(
        conversation_id,
        AnalysisResultResponse.model_validate(analysis).model_dump(),
    )

    return analysis
