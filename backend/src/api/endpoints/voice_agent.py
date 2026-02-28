"""
Voice Agent API Endpoints
LiveKit token generation and AI settings management
"""
from fastapi import APIRouter, Depends, HTTPException, Header, Body
from datetime import timedelta
import logging
import json
import uuid

from src.core.config import settings
from src.cache.redis_client import get_redis

logger = logging.getLogger(__name__)
router = APIRouter()

AI_SETTINGS_KEY = "ai_settings"


async def verify_voice_agent_key(x_api_key: str = Header(None)):
    if not x_api_key or x_api_key != settings.VOICE_AGENT_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


@router.post("/livekit-token")
async def generate_livekit_token():
    """Generate a short-lived LiveKit token for web visitors."""
    from livekit.api import AccessToken, VideoGrants
    from livekit.protocol.room import RoomConfiguration
    from livekit.protocol.agent_dispatch import RoomAgentDispatch

    room_name = f"docusync-demo-{uuid.uuid4().hex[:8]}"
    participant_name = f"visitor-{uuid.uuid4().hex[:6]}"

    token = (
        AccessToken(settings.LIVEKIT_API_KEY, settings.LIVEKIT_API_SECRET)
        .with_identity(participant_name)
        .with_name(participant_name)
        .with_ttl(timedelta(minutes=15))
        .with_grants(VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
            can_publish_data=True,
        ))
        .with_room_config(RoomConfiguration(
            agents=[RoomAgentDispatch(agent_name="docusync-agent")],
        ))
        .to_jwt()
    )

    return {
        "token": token,
        "url": settings.LIVEKIT_URL,
        "room": room_name,
    }


@router.get("/ai-settings")
async def get_ai_settings(
    authorized: bool = Depends(verify_voice_agent_key),
):
    """Get AI agent settings from Redis."""
    try:
        redis = get_redis()
        if redis:
            settings_json = await redis.get(AI_SETTINGS_KEY)
            if settings_json:
                return json.loads(settings_json)
    except Exception as e:
        logger.error(f"Error getting AI settings: {e}")

    return {
        "enabled": True,
        "botName": "Anna",
        "fallbackPhone": "",
    }


@router.post("/ai-settings")
async def save_ai_settings(
    settings_data: dict = Body(...),
    authorized: bool = Depends(verify_voice_agent_key),
):
    """Save AI agent settings to Redis."""
    try:
        redis = get_redis()
        if redis:
            await redis.set(AI_SETTINGS_KEY, json.dumps(settings_data))
            logger.info(f"AI settings saved: {settings_data}")
            return {"status": "success"}
    except Exception as e:
        logger.error(f"Error saving AI settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"status": "success"}
