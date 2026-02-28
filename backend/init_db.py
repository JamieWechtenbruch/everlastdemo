"""Initialize database tables on startup."""
import asyncio
import logging
from src.database.connection import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main():
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized successfully")


if __name__ == "__main__":
    asyncio.run(main())
