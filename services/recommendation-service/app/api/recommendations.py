from fastapi import (
    APIRouter,
    HTTPException,
    status,
    Depends
)

from app.core.auth import get_current_user

from app.schemas.recommendation import (
    RecommendationRequest
)

from app.services.recommendation_service import (
    get_recommendation
)

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.post(
    "/generate",
    status_code=status.HTTP_200_OK
)
def generate_recommendation(
    request: RecommendationRequest,
    current_user=Depends(get_current_user)
):
    try:
        return get_recommendation(
            dataset_id=request.dataset_id,
            user_id=current_user["user_id"],
            goal=request.goal,
            target_column=request.target_column
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )