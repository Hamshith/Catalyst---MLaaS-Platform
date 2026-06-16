from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from app.services.jwt_service import (
    get_user_id_from_token
)

from app.services.user_service import (
    get_user_by_id
)

from app.services.auth_service import (
    change_password
)

from app.schemas.user import (
    PasswordChange
)


router = APIRouter()

security = HTTPBearer()


@router.get("/me")
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):
    token = credentials.credentials

    user_id = get_user_id_from_token(
        token
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = get_user_by_id(
        user_id
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "credits": user["credits"]
    }


@router.post("/change-password")
def update_password(
    request: PasswordChange,
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):
    token = credentials.credentials

    user_id = get_user_id_from_token(
        token
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    try:
        change_password(
            user_id=user_id,
            current_password=request.current_password,
            new_password=request.new_password
        )

        return {
            "message": (
                "Password updated successfully. "
                "Please login again on other devices."
            )
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )