from pydantic import (
    BaseModel,
    EmailStr,
    Field
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class RegistrationOTPRequest(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=8
    )


class RegistrationOTPVerify(BaseModel):
    email: EmailStr
    otp: str = Field(
        min_length=6,
        max_length=6
    )


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(
        min_length=6,
        max_length=6
    )
    new_password: str = Field(
        min_length=8
    )