from tempfile import NamedTemporaryFile

from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from fastapi.responses import (
    FileResponse
)

from app.core.auth import (
    get_current_user
)

from app.services.model_service import (
    get_all_models,
    get_model_by_id
)

from app.services.minio_service import (
    download_model
)


router = APIRouter(
    prefix="/models",
    tags=["Models"]
)


@router.get("")
def list_models(
    current_user=Depends(
        get_current_user
    )
):
    return get_all_models(
        current_user["user_id"]
    )


@router.get("/{model_id}")
def get_model(
    model_id: str,
    current_user=Depends(
        get_current_user
    )
):
    model = get_model_by_id(
        model_id,
        current_user["user_id"]
    )

    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )

    return model


@router.get("/{model_id}/download")
def download_model_file(
    model_id: str,
    current_user=Depends(
        get_current_user
    )
):
    model = get_model_by_id(
        model_id,
        current_user["user_id"]
    )

    if not model:
        raise HTTPException(
            status_code=404,
            detail="Model not found"
        )

    temp_file = NamedTemporaryFile(
        delete=False,
        suffix=".joblib"
    )

    temp_file_path = temp_file.name

    # Required on Windows before MinIO writes to the file
    temp_file.close()

    download_model(
        model["model_path"],
        temp_file_path
    )

    return FileResponse(
        path=temp_file_path,
        filename=f"{model_id}.joblib",
        media_type="application/octet-stream"
    )