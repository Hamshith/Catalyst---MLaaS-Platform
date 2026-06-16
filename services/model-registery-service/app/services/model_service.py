from bson import ObjectId

from app.database.mongodb import (
    models_collection
)


def get_all_models(
    user_id: str
):
    models = []

    for model in models_collection.find(
        {
            "user_id": user_id
        }
    ):
        model["_id"] = str(
            model["_id"]
        )

        models.append(
            model
        )

    return models


def get_model_by_id(
    model_id: str,
    user_id: str
):
    model = models_collection.find_one(
        {
            "_id": ObjectId(model_id),
            "user_id": user_id
        }
    )

    if not model:
        return None

    model["_id"] = str(
        model["_id"]
    )

    return model