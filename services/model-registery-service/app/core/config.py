from pydantic_settings import (
    BaseSettings
)


class Settings(
    BaseSettings
):
    # MinIO
    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str
    MINIO_MODEL_BUCKET: str
    MINIO_SECURE: bool = False

    # MongoDB
    MONGODB_URI: str
    MONGODB_DATABASE: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str

    CORS_ORIGINS:str
    class Config:
        env_file = ".env"


settings = Settings()