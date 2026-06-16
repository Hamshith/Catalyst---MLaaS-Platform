from datetime import datetime

from bson import ObjectId

from app.database.mongodb import (
    users_collection,
    credit_transactions_collection
)


MODEL_CREDITS = {
    # Low Tier
    "logistic_regression": 5,
    "linear_regression": 5,
    "kmeans": 5,

    # Medium Tier
    "random_forest_classifier": 10,
    "random_forest_regressor": 10,
    "xgboost_classifier": 15,
    "xgboost_regressor": 15,

    # High Tier
    "svm_classifier": 20,
    "svr": 20,
    "dbscan": 20
}


def get_credit_balance(user_id: str):
    user = users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:
        return None

    return {
        "credits": user.get("credits", 0)
    }


def validate_credits(
    user_id: str,
    model_type: str
):
    user = users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:
        return {
            "allowed": False,
            "message": "User not found"
        }

    credits_required = MODEL_CREDITS.get(model_type)

    if credits_required is None:
        return {
            "allowed": False,
            "message": "Invalid model type"
        }

    available_credits = user.get("credits", 0)

    return {
        "allowed": available_credits >= credits_required,
        "credits_required": credits_required,
        "remaining_credits": available_credits
    }


def debit_credits(
    user_id: str,
    request_id: str,
    model_type: str
):
    credits_required = MODEL_CREDITS.get(model_type)

    if credits_required is None:
        return {
            "success": False,
            "message": "Invalid model type"
        }

    user = users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    current_credits = user.get("credits", 0)

    if current_credits < credits_required:
        return {
            "success": False,
            "message": "Insufficient credits"
        }

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

    return {
        "success": True,
        "credits_deducted": credits_required,
        "remaining_credits": current_credits - credits_required
    }


def get_credit_history(user_id: str):
    transactions = []

    for transaction in credit_transactions_collection.find(
        {
            "user_id": user_id
        }
    ).sort(
        "created_at",
        -1
    ):
        transaction["_id"] = str(transaction["_id"])
        transactions.append(transaction)

    return transactions


def add_credits(
    user_id: str,
    credits: int,
    reason: str = "MANUAL_TOPUP"
):
    if credits <= 0:
        return {
            "success": False,
            "message": "Credits must be greater than 0"
        }

    user = users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    users_collection.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$inc": {
                "credits": credits
            }
        }
    )

    updated_user = users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )

    credit_transactions_collection.insert_one(
        {
            "user_id": user_id,
            "credits_added": credits,
            "transaction_type": "CREDIT",
            "reason": reason,
            "created_at": datetime.utcnow()
        }
    )

    return {
        "success": True,
        "credits_added": credits,
        "current_balance": updated_user.get("credits", 0)
    }