import redis.asyncio as aioredis
import logging
from src.core.config import settings

logger = logging.getLogger(__name__)

redis_client = None


async def init_redis():
    global redis_client
    try:
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
        await redis_client.ping()
        logger.info("Redis connected successfully")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
        redis_client = None


def get_redis():
    return redis_client
