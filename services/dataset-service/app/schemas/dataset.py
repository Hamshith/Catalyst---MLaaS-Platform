from datetime import datetime

from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: str
    user_id: str

    filename: str

    storage_path: str

    created_at: datetime


class DatasetProfile(BaseModel):
    rows: int
    columns: int

    numerical_columns: int
    categorical_columns: int

    missing_percentage: float