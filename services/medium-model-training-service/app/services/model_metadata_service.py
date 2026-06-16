from datetime import datetime, UTC

from app.database.mongodb import db


models_collection = db["models"]


def create_model_record(
    user_id: str,
    request_id: str,
    model_type: str,
    model_path: str,
    metrics: dict
):
    print("Metrics:", metrics)

    for k, v in metrics.items():
        print(k, v, type(v))

    return models_collection.insert_one(
        {
            "user_id": user_id,
            "request_id": request_id,
            "model_type": model_type,
            "model_path": model_path,
            "metrics": metrics,
            "created_at": datetime.now(UTC)
        }
    )