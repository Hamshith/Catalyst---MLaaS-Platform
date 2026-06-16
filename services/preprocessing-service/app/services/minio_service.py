from minio import Minio

from app.core.config import settings


BUCKET_NAME = "datasets"


client = Minio(
    endpoint=settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False
)


if not client.bucket_exists(BUCKET_NAME):
    client.make_bucket(BUCKET_NAME)


def download_file(
    object_name: str,
    file_path: str
):
    client.fget_object(
        BUCKET_NAME,
        object_name,
        file_path
    )

    return file_path


def upload_file(
    object_name: str,
    file_path: str
):
    result = client.fput_object(
        BUCKET_NAME,
        object_name,
        file_path
    )

    return result.object_name


def object_exists(
    object_name: str
) -> bool:
    try:
        client.stat_object(
            BUCKET_NAME,
            object_name
        )
        return True

    except Exception:
        return False