from datetime import (
    datetime,
    timedelta,
    UTC
)

from app.database.mongodb import db


refresh_tokens_collection = db["refresh_tokens"]


REFRESH_TOKEN_EXPIRE_DAYS = 30


def store_refresh_token(
    user_id: str,
    token: str
):
    refresh_tokens_collection.insert_one(
        {
            "user_id": user_id,
            "token": token,
            "revoked": False,
            "created_at": datetime.now(UTC),
            "expires_at": datetime.now(UTC)
            + timedelta(
                days=REFRESH_TOKEN_EXPIRE_DAYS
            )
        }
    )


def get_refresh_token(
    token: str
):
    return refresh_tokens_collection.find_one(
        {
            "token": token,
            "revoked": False
        }
    )


def revoke_refresh_token(
    token: str
):
    refresh_tokens_collection.update_one(
        {
            "token": token
        },
        {
            "$set": {
                "revoked": True
            }
        }
    )


def revoke_all_user_tokens(
    user_id: str
):
    refresh_tokens_collection.update_many(
        {
            "user_id": user_id
        },
        {
            "$set": {
                "revoked": True
            }
        }
    )