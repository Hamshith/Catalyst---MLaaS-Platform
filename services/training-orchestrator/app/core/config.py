from pydantic_settings import (
    BaseSettings
)


class Settings(
    BaseSettings
):
    RABBITMQ_HOST: str
    RABBITMQ_PORT: int

    TRAINING_QUEUE: str

    LOW_TRAINING_QUEUE: str
    MEDIUM_TRAINING_QUEUE: str
    HIGH_TRAINING_QUEUE: str

    class Config:
        env_file = ".env"


settings = Settings()