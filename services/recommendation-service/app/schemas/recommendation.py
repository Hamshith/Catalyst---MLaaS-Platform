from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    dataset_id: str
    goal: str | None = None
    target_column: str | None = None