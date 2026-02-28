import os
import json
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


def parse_cors_origins(origins_str: str = None) -> List[str]:
    if not origins_str:
        origins_str = os.getenv("ALLOWED_ORIGINS")
    if origins_str:
        try:
            return json.loads(origins_str)
        except json.JSONDecodeError:
            return [origin.strip() for origin in origins_str.split(",")]
    return ["http://localhost:3000", "http://localhost:3001"]


class Settings(BaseSettings):
    APP_NAME: str = "Kreativstrom Voice Agent API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    VOICE_AGENT_API_KEY: str = os.getenv("VOICE_AGENT_API_KEY", "")
    ALLOWED_ORIGINS: List[str] = parse_cors_origins()

    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://localhost/docusync_db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    LIVEKIT_URL: str = os.getenv("LIVEKIT_URL", "")
    LIVEKIT_API_KEY: str = os.getenv("LIVEKIT_API_KEY", "")
    LIVEKIT_API_SECRET: str = os.getenv("LIVEKIT_API_SECRET", "")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"


settings = Settings()
