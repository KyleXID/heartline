from fastapi import APIRouter

from app.api.conversations.routes import router as conversations_router

router = APIRouter()
router.include_router(conversations_router)
