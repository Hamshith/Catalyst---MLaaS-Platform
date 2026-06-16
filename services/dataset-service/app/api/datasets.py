import os
import tempfile
from uuid import uuid4

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
    status
)

from app.core.auth import get_current_user

from app.services.dataset_service import (
    create_dataset,
    get_dataset_by_id,
    get_user_datasets,
    delete_dataset
)

from app.services.minio_service import (
    upload_file,
    remove_file
)

from app.services.profile_service import (
    generate_profile
)

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required"
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".csv"
        ) as temp_file:

            content = await file.read()

            temp_file.write(content)

            temp_path = temp_file.name

        # Generate dataset profile
        profile = generate_profile(
            temp_path
        )

        # Generate unique filename to avoid overwriting
        unique_filename = (
            f"{uuid4()}_{file.filename}"
        )

        object_name = (
            f"raw/{unique_filename}"
        )

        # Upload file to MinIO
        upload_file(
            object_name=object_name,
            file_path=temp_path
        )

        # Store metadata in MongoDB
        dataset_id = create_dataset(
            {
                "user_id": current_user["user_id"],
                "filename": file.filename,
                "storage_path": object_name,
                "profile": profile
            }
        )

        return {
            "message": "Dataset uploaded successfully",
            "dataset_id": dataset_id,
            "profile": profile
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


@router.get("/{dataset_id}")
def get_dataset(
    dataset_id: str,
    current_user=Depends(get_current_user)
):
    dataset = get_dataset_by_id(
        dataset_id
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if dataset.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    dataset["_id"] = str(
        dataset["_id"]
    )

    return dataset


@router.get("/")
def get_datasets(
    current_user=Depends(get_current_user)
):
    datasets = get_user_datasets(
        current_user["user_id"]
    )

    for dataset in datasets:
        dataset["_id"] = str(
            dataset["_id"]
        )

    return datasets


@router.delete("/{dataset_id}")
def remove_dataset(
    dataset_id: str,
    current_user=Depends(get_current_user)
):
    dataset = get_dataset_by_id(
        dataset_id
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if dataset.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    try:
        # Delete from MinIO
        remove_file(
            dataset["storage_path"]
        )

        # Delete metadata from MongoDB
        result = delete_dataset(
            dataset_id
        )

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Dataset not found"
            )

        return {
            "message": "Dataset deleted successfully"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete dataset: {str(e)}"
        )