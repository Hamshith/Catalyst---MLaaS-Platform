import random
from datetime import (
    datetime,
    timedelta
)

from app.database.mongodb import db


registration_otps = db["registration_otps"]
password_reset_otps = db["password_reset_otps"]


def generate_otp():
    return str(
        random.randint(
            100000,
            999999
        )
    )


def store_registration_otp(
    email: str,
    hashed_password: str,
    otp: str
):
    registration_otps.delete_many(
        {
            "email": email
        }
    )

    registration_otps.insert_one(
        {
            "email": email,
            "hashed_password": hashed_password,
            "otp": otp,
            "expires_at": datetime.utcnow() + timedelta(
                minutes=10
            ),
            "used": False
        }
    )


def get_registration_otp(
    email: str,
    otp: str
):
    return registration_otps.find_one(
        {
            "email": email,
            "otp": otp,
            "used": False
        }
    )


def mark_registration_otp_used(
    otp_id
):
    registration_otps.update_one(
        {
            "_id": otp_id
        },
        {
            "$set": {
                "used": True
            }
        }
    )


def store_password_reset_otp(
    email: str,
    otp: str
):
    password_reset_otps.delete_many(
        {
            "email": email
        }
    )

    password_reset_otps.insert_one(
        {
            "email": email,
            "otp": otp,
            "expires_at": datetime.utcnow() + timedelta(
                minutes=10
            ),
            "used": False
        }
    )


def get_password_reset_otp(
    email: str,
    otp: str
):
    return password_reset_otps.find_one(
        {
            "email": email,
            "otp": otp,
            "used": False
        }
    )


def mark_password_reset_otp_used(
    otp_id
):
    password_reset_otps.update_one(
        {
            "_id": otp_id
        },
        {
            "$set": {
                "used": True
            }
        }
    )