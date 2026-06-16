from pydantic_settings import (
    BaseSettings
)


class Settings(
    BaseSettings
):
    # RabbitMQ
    RABBITMQ_HOST: str
    RABBITMQ_PORT: int

    LOW_TRAINING_QUEUE: str

    # MinIO
    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str

    MINIO_DATASET_BUCKET: str
    MINIO_MODEL_BUCKET: str

    MINIO_SECURE: bool = False

    # MongoDB
    MONGODB_URI: str
    MONGODB_DATABASE: str

    class Config:
        env_file = ".env"


settings = Settings()