from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from pydantic import BaseModel

from app.core.auth import (
    get_current_user
)

from app.services.credit_service import (
    get_credit_balance,
    validate_credits,
    debit_credits,
    get_credit_history,
    add_credits
)


router = APIRouter(
    prefix="/credits",
    tags=["Credits"]
)


class ValidateCreditsRequest(BaseModel):
    model_type: str


class DebitCreditsRequest(BaseModel):
    request_id: str
    model_type: str

class AddCreditsRequest(BaseModel):
    credits: int
    reason: str = "MANUAL_TOPUP"


@router.get("/balance")
def get_balance(
    current_user=Depends(
        get_current_user
    )
):
    result = get_credit_balance(
        current_user["user_id"]
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return result


@router.post("/validate")
def validate_user_credits(
    request: ValidateCreditsRequest,
    current_user=Depends(
        get_current_user
    )
):
    result = validate_credits(
        current_user["user_id"],
        request.model_type
    )

    if not result.get("allowed"):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=result
        )

    return result


@router.post("/debit")
def debit_user_credits(
    request: DebitCreditsRequest,
    current_user=Depends(
        get_current_user
    )
):
    result = debit_credits(
        current_user["user_id"],
        request.request_id,
        request.model_type
    )

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )

    return result


@router.get("/history")
def get_history(
    current_user=Depends(
        get_current_user
    )
):
    return get_credit_history(
        current_user["user_id"]
    )

@router.post("/add")
def add_user_credits(
    request: AddCreditsRequest,
    current_user=Depends(get_current_user)
):
    result = add_credits(
        current_user["user_id"],
        request.credits,
        request.reason
    )

    if not result["success"]:
        raise HTTPException(
            status_code=400,
            detail=result["message"]
        )

    return result