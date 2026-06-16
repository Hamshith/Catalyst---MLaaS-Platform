from datetime import datetime, UTC

from bson import ObjectId

from app.database.mongodb import db


requests_collection = db["requests"]


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