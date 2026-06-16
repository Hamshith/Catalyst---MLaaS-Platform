from minio import Minio

from app.core.config import (
    settings
)


client = Minio(
    endpoint=settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_SECURE
)


def download_model(
    object_name: str,
    file_path: str
):
    client.fget_object(
        bucket_name=settings.MINIO_MODEL_BUCKET,
        object_name=object_name,
        file_path=file_path
    )