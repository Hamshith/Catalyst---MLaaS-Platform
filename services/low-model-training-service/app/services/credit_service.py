from datetime import datetime

from bson import ObjectId

from app.database.mongodb import db


users_collection = db["users"]
credit_transactions_collection = db["credit_transactions"]


MODEL_CREDITS = {
    # Low Tier
    "logistic_regression": 5,
    "linear_regression": 5,
    "kmeans": 5,
}


def debit_credits(
    user_id: str,
    request_id: str,
    model_type: str
):
    credits_required = MODEL_CREDITS.get(
        model_type
    )

    if credits_required is None:
        print(
            f"Unknown model type for "
            f"credits: {model_type}"
        )
        return

    user = users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:
        print(
            f"User not found for credit "
            f"debit: {user_id}"
        )
        return

    current_credits = user.get("credits", 0)

    if current_credits < credits_required:
        print(
            f"Insufficient credits for "
            f"user {user_id}: "
            f"has {current_credits}, "
            f"needs {credits_required}"
        )
        return

    users_collection.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$inc": {
                "credits": -credits_required
            }
        }
    )

    credit_transactions_collection.insert_one(
        {
            "user_id": user_id,
            "request_id": request_id,
            "model_type": model_type,
            "credits_used": credits_required,
            "transaction_type": "DEBIT",
            "created_at": datetime.utcnow()
        }
    )

    print(
        f"Debited {credits_required} credits "
        f"from user {user_id} for "
        f"request {request_id}"
    )
