from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)

class Settings(BaseSettings):
    MONGO_URI: str
    MONGODB_DATABASE: str

    RABBITMQ_HOST: str
    RABBITMQ_PORT: int = 5672

    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str

    TRAINING_QUEUE: str = "training_queue"
    REQUEST_QUEUE: str = "preprocessing_queue"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()