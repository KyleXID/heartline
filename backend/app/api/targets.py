from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth import CurrentUserDep
from app.dependencies import DbDep
from app.models.target import Target
from app.schemas.target import TargetCreate, TargetResponse, TargetUpdate

router = APIRouter(prefix="/api/targets", tags=["targets"])


@router.get("/", response_model=list[TargetResponse])
async def list_targets(db: DbDep, user: CurrentUserDep) -> list[Target]:
    result = await db.execute(
        select(Target).where(Target.user_id == user.id).order_by(Target.created_at.desc())
    )
    return list(result.scalars().all())


@router.post("/", response_model=TargetResponse, status_code=status.HTTP_201_CREATED)
async def create_target(data: TargetCreate, db: DbDep, user: CurrentUserDep) -> Target:
    target = Target(user_id=user.id, **data.model_dump())
    db.add(target)
    await db.commit()
    await db.refresh(target)
    return target


@router.get("/{target_id}", response_model=TargetResponse)
async def get_target(target_id: str, db: DbDep, user: CurrentUserDep) -> Target:
    target = await _get_user_target(db, target_id, user.id)
    return target


@router.patch("/{target_id}", response_model=TargetResponse)
async def update_target(target_id: str, data: TargetUpdate, db: DbDep, user: CurrentUserDep) -> Target:
    target = await _get_user_target(db, target_id, user.id)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(target, key, value)
    await db.commit()
    await db.refresh(target)
    return target


@router.delete("/{target_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_target(target_id: str, db: DbDep, user: CurrentUserDep) -> None:
    target = await _get_user_target(db, target_id, user.id)
    await db.delete(target)
    await db.commit()


async def _get_user_target(db: AsyncSession, target_id: str, user_id) -> Target:
    result = await db.execute(
        select(Target).where(Target.id == target_id, Target.user_id == user_id)
    )
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="대상을 찾을 수 없습니다.")
    return target
