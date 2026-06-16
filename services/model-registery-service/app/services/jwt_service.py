from jose import JWTError, jwt

from app.core.config import settings


def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )

        if payload.get("type") != "access" or not payload.get("sub"):
            return None

        return payload

    except JWTError:
        return None