from fastapi import (
    APIRouter,
    HTTPException
)

from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RegistrationOTPRequest,
    RegistrationOTPVerify,
    RefreshTokenRequest,
    LogoutRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)

from app.services.auth_service import (
    register_user,
    verify_registration_otp,
    login_user,
    refresh_access_token,
    logout_user,
    forgot_password,
    reset_password
)


router = APIRouter()


@router.post("/register/request-otp")
def request_registration_otp(
    user: RegistrationOTPRequest
):
    try:
        register_user(user)

        return {
            "message": (
                "OTP sent successfully "
                "to your email"
            )
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/register/verify",
    response_model=TokenResponse
)
def verify_registration(
    data: RegistrationOTPVerify
):
    try:
        result = verify_registration_otp(
            data.email,
            data.otp
        )

        return {
            "access_token": result[
                "access_token"
            ],
            "refresh_token": result[
                "refresh_token"
            ],
            "token_type": "bearer"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    credentials: LoginRequest
):
    try:
        tokens = login_user(
            credentials.email,
            credentials.password
        )

        return {
            "access_token": tokens[
                "access_token"
            ],
            "refresh_token": tokens[
                "refresh_token"
            ],
            "token_type": "bearer"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@router.post(
    "/refresh",
    response_model=TokenResponse
)
def refresh_token(
    request: RefreshTokenRequest
):
    try:
        tokens = refresh_access_token(
            request.refresh_token
        )

        return {
            "access_token": tokens[
                "access_token"
            ],
            "refresh_token": tokens[
                "refresh_token"
            ],
            "token_type": "bearer"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


@router.post("/logout")
def logout(
    request: LogoutRequest
):
    try:
        logout_user(
            request.refresh_token
        )

        return {
            "message": (
                "Logged out successfully"
            )
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/forgot-password")
def forgot_password_otp(
    request: ForgotPasswordRequest
):
    try:
        forgot_password(
            request.email
        )

        return {
            "message": (
                "Password reset OTP "
                "sent successfully"
            )
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/reset-password")
def reset_user_password(
    request: ResetPasswordRequest
):
    try:
        reset_password(
            request.email,
            request.otp,
            request.new_password
        )

        return {
            "message": (
                "Password reset "
                "successfully"
            )
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )