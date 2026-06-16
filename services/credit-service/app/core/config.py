from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)


class Settings(BaseSettings):
    # MongoDB
    MONGODB_URI: str
    MONGODB_DATABASE: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str

    CORS_ORIGINS: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()