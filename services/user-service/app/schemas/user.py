from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
    credits: int
    created_at: datetime


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class UserInDB(BaseModel):
    id: str
    email: EmailStr
    hashed_password: str
    role: str
    credits: int
    created_at: datetime