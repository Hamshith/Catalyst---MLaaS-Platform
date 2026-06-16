from datetime import datetime

from app.services.user_service import (
    create_user,
    get_user_by_email,
    update_password,
    get_user_by_id
)

from app.services.jwt_service import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token
)

from app.services.password_service import (
    hash_password,
    verify_password
)

from app.services.otp_service import (
    generate_otp,
    store_registration_otp,
    get_registration_otp,
    mark_registration_otp_used,
    store_password_reset_otp,
    get_password_reset_otp,
    mark_password_reset_otp_used
)

from app.services.email_service import (
    send_otp_email
)

from app.services.refresh_token_service import (
    store_refresh_token,
    get_refresh_token,
    revoke_refresh_token,
    revoke_all_user_tokens
)


def register_user(user):
    existing_user = get_user_by_email(
        user.email
    )

    if existing_user:
        raise ValueError(
            "Email already registered"
        )

    hashed_password = hash_password(
        user.password
    )

    otp = generate_otp()

    store_registration_otp(
        email=user.email,
        hashed_password=hashed_password,
        otp=otp
    )

    send_otp_email(
        user.email,
        otp,
        "REGISTRATION"
    )

    return True


def verify_registration_otp(
    email: str,
    otp: str
):
    otp_record = get_registration_otp(
        email,
        otp
    )

    if not otp_record:
        raise ValueError(
            "Invalid OTP"
        )

    if otp_record["expires_at"] < datetime.utcnow():
        raise ValueError(
            "OTP expired"
        )

    user_data = {
        "email": email,
        "hashed_password": otp_record[
            "hashed_password"
        ],
        "role": "user",
        "credits": 100
    }

    user_id = create_user(
        user_data
    )

    mark_registration_otp_used(
        otp_record["_id"]
    )

    access_token = create_access_token(
        user_id
    )

    refresh_token = create_refresh_token(
        user_id
    )

    store_refresh_token(
        user_id,
        refresh_token
    )

    return {
        "user_id": user_id,
        "access_token": access_token,
        "refresh_token": refresh_token
    }


def login_user(
    email,
    password
):
    user = get_user_by_email(
        email
    )

    if not user:
        raise ValueError(
            "Invalid credentials"
        )

    if not verify_password(
        password,
        user["hashed_password"]
    ):
        raise ValueError(
            "Invalid credentials"
        )

    access_token = create_access_token(
        str(user["_id"])
    )

    refresh_token = create_refresh_token(
        str(user["_id"])
    )

    store_refresh_token(
        str(user["_id"]),
        refresh_token
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


def refresh_access_token(
    refresh_token: str
):
    payload = verify_refresh_token(
        refresh_token
    )

    if not payload:
        raise ValueError(
            "Invalid refresh token"
        )

    token_record = get_refresh_token(
        refresh_token
    )

    if not token_record:
        raise ValueError(
            "Refresh token revoked"
        )

    user_id = payload["sub"]

    revoke_refresh_token(
        refresh_token
    )

    new_access_token = create_access_token(
        user_id
    )

    new_refresh_token = create_refresh_token(
        user_id
    )

    store_refresh_token(
        user_id,
        new_refresh_token
    )

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token
    }


def logout_user(
    refresh_token: str
):
    revoke_refresh_token(
        refresh_token
    )

    return True


def forgot_password(
    email: str
):
    user = get_user_by_email(
        email
    )

    if not user:
        raise ValueError(
            "User not found"
        )

    otp = generate_otp()

    store_password_reset_otp(
        email,
        otp
    )

    send_otp_email(
        email,
        otp,
        "PASSWORD_RESET"
    )

    return True


def reset_password(
    email: str,
    otp: str,
    new_password: str
):
    otp_record = get_password_reset_otp(
        email,
        otp
    )

    if not otp_record:
        raise ValueError(
            "Invalid OTP"
        )

    if otp_record["expires_at"] < datetime.utcnow():
        raise ValueError(
            "OTP expired"
        )

    user = get_user_by_email(
        email
    )

    if not user:
        raise ValueError(
            "User not found"
        )

    hashed_password = hash_password(
        new_password
    )

    update_password(
        str(user["_id"]),
        hashed_password
    )

    revoke_all_user_tokens(
        str(user["_id"])
    )

    mark_password_reset_otp_used(
        otp_record["_id"]
    )

    return True


def change_password(
    user_id: str,
    current_password: str,
    new_password: str
):
    user = get_user_by_id(
        user_id
    )

    if not user:
        raise ValueError(
            "User not found"
        )

    if not verify_password(
        current_password,
        user["hashed_password"]
    ):
        raise ValueError(
            "Current password is incorrect"
        )

    new_hashed_password = hash_password(
        new_password
    )

    update_password(
        user_id,
        new_hashed_password
    )

    revoke_all_user_tokens(
        user_id
    )

    return True