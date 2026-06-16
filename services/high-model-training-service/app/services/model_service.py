import joblib

from app.services.minio_service import (
    upload_model
)


def save_model(
    model,
    request_id: str,
    local_model_path: str
) -> str:

    joblib.dump(
        model,
        local_model_path
    )

    model_object_name = (
        f"models/high/{request_id}.joblib"
    )

    upload_model(
        model_object_name,
        local_model_path
    )

    return model_object_name