from bson import ObjectId

from app.database.mongodb import db


datasets_collection = db["datasets"]


def get_dataset_by_id(dataset_id: str):
    return datasets_collection.find_one(
        {
            "_id": ObjectId(dataset_id)
        }
    )