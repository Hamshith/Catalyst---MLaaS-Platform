from datetime import datetime, UTC

from bson import ObjectId

from app.database.mongodb import db


requests_collection = db["requests"]


def create_request(request_data: dict) -> str:
    now = datetime.now(UTC)

    request_data["created_at"] = now
    request_data["updated_at"] = now

    result = requests_collection.insert_one(request_data)

    return str(result.inserted_id)


def get_request_by_id(request_id: str):
    return requests_collection.find_one(
        {
            "_id": ObjectId(request_id)
        }
    )


def get_user_requests(user_id: str):
    return list(
        requests_collection.find(
            {
                "user_id": user_id
            }
        )
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


def delete_request(request_id: str):
    return requests_collection.delete_one(
        {
            "_id": ObjectId(request_id)
        }
    )

def update_request(
    request_id: str,
    update_data: dict
):
    update_data["updated_at"] = datetime.now(UTC)

    return requests_collection.update_one(
        {
            "_id": ObjectId(request_id)
        },
        {
            "$set": update_data
        }
    )