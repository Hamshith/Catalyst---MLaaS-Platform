from datetime import datetime, UTC

from bson import ObjectId

from app.database.mongodb import db


requests_collection = db["requests"]


def get_request_by_id(
    request_id: str
):
    return requests_collection.find_one(
        {
            "_id": ObjectId(request_id)
        }
    )


def update_request_status(
    request_id: str,
    status: str
):
    return requests_collection.update_one(
        {
            "_id": ObjectId(request_id)
        },
        {
            "$set": {
                "status": status,
                "updated_at": datetime.now(UTC)
            }
        }
    )


def update_processed_dataset_path(
    request_id: str,
    processed_dataset_path: str
):
    return requests_collection.update_one(
        {
            "_id": ObjectId(request_id)
        },
        {
            "$set": {
                "processed_dataset_path": processed_dataset_path,
                "updated_at": datetime.now(UTC)
            }
        }
    )