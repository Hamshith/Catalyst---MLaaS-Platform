from datetime import datetime, UTC

from bson import ObjectId

from app.database.mongodb import db


datasets_collection = db["datasets"]


def create_dataset(dataset_data: dict) -> str:
    now = datetime.now(UTC)

    dataset_data["created_at"] = now
    dataset_data["updated_at"] = now

    result = datasets_collection.insert_one(
        dataset_data
    )

    return str(result.inserted_id)


def get_dataset_by_id(dataset_id: str):
    return datasets_collection.find_one(
        {
            "_id": ObjectId(dataset_id)
        }
    )


def get_user_datasets(user_id: str):
    return list(
        datasets_collection.find(
            {
                "user_id": user_id
            }
        )
    )


def delete_dataset(dataset_id: str):
    return datasets_collection.delete_one(
        {
            "_id": ObjectId(dataset_id)
        }
    )


def update_dataset_profile(
    dataset_id: str,
    profile: dict
):
    return datasets_collection.update_one(
        {
            "_id": ObjectId(dataset_id)
        },
        {
            "$set": {
                "profile": profile,
                "updated_at": datetime.now(UTC)
            }
        }
    )


def update_dataset(
    dataset_id: str,
    update_data: dict
):
    update_data["updated_at"] = datetime.now(UTC)

    return datasets_collection.update_one(
        {
            "_id": ObjectId(dataset_id)
        },
        {
            "$set": update_data
        }
    )