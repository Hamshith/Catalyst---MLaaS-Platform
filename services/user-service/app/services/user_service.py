from datetime import (
    datetime,
    UTC
)

from bson import ObjectId

from app.database.mongodb import (
    users_collection
)


def create_user(
    user_data: dict
):
    user_data["created_at"] = datetime.now(
        UTC
    )

    result = users_collection.insert_one(
        user_data
    )

    return str(
        result.inserted_id
    )


def get_user_by_email(
    email: str
):
    return users_collection.find_one(
        {
            "email": email
        }
    )


def get_user_by_id(
    user_id: str
):
    try:
        return users_collection.find_one(
            {
                "_id": ObjectId(
                    user_id
                )
            }
        )

    except Exception:
        return None


def update_password(
    user_id: str,
    hashed_password: str
):
    return users_collection.update_one(
        {
            "_id": ObjectId(
                user_id
            )
        },
        {
            "$set": {
                "hashed_password": hashed_password
            }
        }
    )


def update_credits(
    user_id: str,
    credits: int
):
    return users_collection.update_one(
        {
            "_id": ObjectId(
                user_id
            )
        },
        {
            "$set": {
                "credits": credits
            }
        }
    )