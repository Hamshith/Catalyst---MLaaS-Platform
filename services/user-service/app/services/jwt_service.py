from datetime import (
    datetime,
    timedelta,
    UTC
)

from dotenv import load_dotenv
from jose import (
    JWTError,
    jwt
)

import os


load_dotenv()


SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)

ALGORITHM = os.getenv(
    "JWT_ALGORITHM"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "JWT_ACCESS_TOKEN_EXPIRE_MINUTES"
    )
)

REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv(
        "JWT_REFRESH_TOKEN_EXPIRE_DAYS"
    )
)


def create_access_token(
    user_id: str
) -> str:
    expire = datetime.now(
        UTC
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user_id,
        "type": "access",
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_access_token(
    token: str
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get(
            "type"
        ) != "access" or not payload.get("sub"):
            return None

        return payload

    except JWTError:
        return None


def get_user_id_from_token(
    token: str
):
    payload = verify_access_token(
        token
    )

    if not payload:
        return None

    return payload.get(
        "sub"
    )


def create_refresh_token(
    user_id: str
) -> str:
    expire = datetime.now(
        UTC
    ) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_refresh_token(
    token: str
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get(
            "type"
        ) != "refresh" or not payload.get("sub"):
            return None

        return payload

    except JWTError:
        return None


def get_user_id_from_refresh_token(
    token: str
):
    payload = verify_refresh_token(
        token
    )

    if not payload:
        return None

    return payload.get(
        "sub"
    )