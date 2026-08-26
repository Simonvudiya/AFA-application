from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    DATABASE_URL: str = "sqlite+aiosqlite:///./afa_cbirs.db"
    POSTGIS_EXTENSION: str = "postgis"
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

settings = Settings()
