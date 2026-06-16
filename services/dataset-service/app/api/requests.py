from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    status
)

from app.core.auth import get_current_user

from app.schemas.request import CreateTrainingRequest

from app.schemas.enums import (
    RequestStatus,
    LearningType
)

from app.services.request_service import (
    create_request,
    get_request_by_id,
    get_user_requests
)

from app.services.dataset_service import (
    get_dataset_by_id
)

from app.services.rabbitmq_service import (
    publish_message
)

router = APIRouter(
    prefix="/requests",
    tags=["Requests"]
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_training_request(
    request: CreateTrainingRequest,
    current_user=Depends(get_current_user)
):
    dataset = get_dataset_by_id(
        request.dataset_id
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if dataset["user_id"] != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if request.learning_type == LearningType.SUPERVISED:

        profile = dataset.get("profile")

        if not profile:
            raise HTTPException(
                status_code=400,
                detail="Dataset profile not generated yet"
            )

        column_names = profile.get(
            "column_names",
            []
        )

        if request.target_column not in column_names:
            raise HTTPException(
                status_code=400,
                detail=f"Target column '{request.target_column}' not found in dataset"
            )

    request_data = {
        **request.model_dump(mode="json"),
        "user_id": current_user["user_id"],
        "status": RequestStatus.QUEUED.value
    }

    request_id = create_request(
        request_data
    )

    rabbitmq_payload = {
        "request_id": request_id,

        "dataset_id": request.dataset_id,

        "user_id": current_user["user_id"],

        "learning_type": request.learning_type.value,

        "problem_type": (
            request.problem_type.value
            if request.problem_type
            else None
        ),

        "target_column": request.target_column,

        "classification_model": (
            request.classification_model.value
            if request.classification_model
            else None
        ),

        "regression_model": (
            request.regression_model.value
            if request.regression_model
            else None
        ),

        "unsupervised_model": (
            request.unsupervised_model.value
            if request.unsupervised_model
            else None
        ),

        "missing_value_strategy": (
            request.missing_value_strategy.value
        ),

        "encoding_method": (
            request.encoding_method.value
        ),

        "feature_selection_method": (
            request.feature_selection_method.value
        ),

        "scaling_method": (
            request.scaling_method.value
        ),

        "pca": request.pca,

        "status": RequestStatus.QUEUED.value
    }

    publish_message(
        rabbitmq_payload
    )

    return {
        "request_id": request_id,
        "status": RequestStatus.QUEUED.value
    }


@router.get("/{request_id}")
def get_request(
    request_id: str,
    current_user=Depends(get_current_user)
):
    request_data = get_request_by_id(
        request_id
    )

    if not request_data:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    if request_data["user_id"] != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    request_data["_id"] = str(
        request_data["_id"]
    )

    return request_data


@router.get("/")
def get_requests(
    current_user=Depends(get_current_user)
):
    requests = get_user_requests(
        current_user["user_id"]
    )

    for request in requests:
        request["_id"] = str(
            request["_id"]
        )

    return requests