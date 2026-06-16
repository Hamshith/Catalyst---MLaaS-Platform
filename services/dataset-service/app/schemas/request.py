from datetime import datetime

from pydantic import (
    BaseModel,
    model_validator
)

from app.schemas.enums import (
    MissingValueStrategy,
    EncodingMethod,
    FeatureSelectionMethod,
    ScalingMethod,
    RequestStatus,
    LearningType,
    ProblemType,
    UnsupervisedModelType,
    ClassificationModelType,
    RegressionModelType
)


class CreateTrainingRequest(BaseModel):
    dataset_id: str
    learning_type: LearningType
    problem_type: ProblemType | None = None
    target_column: str | None = None
    classification_model: ClassificationModelType | None = None
    regression_model: RegressionModelType | None = None
    unsupervised_model: UnsupervisedModelType | None = None
    missing_value_strategy: MissingValueStrategy
    encoding_method: EncodingMethod
    feature_selection_method: FeatureSelectionMethod
    scaling_method: ScalingMethod
    pca: bool = False

    @model_validator(mode="after")
    def validate_learning_configuration(self):

        if self.learning_type == LearningType.SUPERVISED:

            if self.problem_type is None:
                raise ValueError(
                "problem_type is required for supervised learning"
            )

            if not self.target_column:
                raise ValueError(
                "target_column is required for supervised learning"
            )

            if self.problem_type == ProblemType.CLASSIFICATION:

                if self.classification_model is None:
                    raise ValueError(
                        "classification_model is required"
                    )

                if self.regression_model is not None:
                    raise ValueError(
                        "regression_model must be null"
                    )

            if self.problem_type == ProblemType.REGRESSION:

                if self.regression_model is None:
                    raise ValueError(
                        "regression_model is required"
                    )

                if self.classification_model is not None:
                    raise ValueError(
                        "classification_model must be null"
                    )

            if self.unsupervised_model is not None:
                raise ValueError(
                    "unsupervised_model must be null"
                )

        if self.learning_type == LearningType.UNSUPERVISED:

            if self.problem_type is not None:
                raise ValueError(
                    "problem_type must be null"
                )

            if self.target_column is not None:
                raise ValueError(
                    "target_column must be null"
                )

            if self.classification_model is not None:
                raise ValueError(
                    "classification_model must be null"
                )

            if self.regression_model is not None:
                raise ValueError(
                    "regression_model must be null"
                )

            if self.unsupervised_model is None:
                raise ValueError(
                    "unsupervised_model is required"
                )
        return self


class TrainingRequestResponse(BaseModel):
    id: str
    user_id: str
    dataset_id: str
    learning_type: LearningType
    problem_type: ProblemType | None = None
    target_column: str | None = None
    classification_model: ClassificationModelType | None = None
    regression_model: RegressionModelType | None = None
    unsupervised_model: UnsupervisedModelType | None = None
    missing_value_strategy: MissingValueStrategy
    encoding_method: EncodingMethod
    feature_selection_method: FeatureSelectionMethod
    scaling_method: ScalingMethod
    pca: bool
    status: RequestStatus
    created_at: datetime
    updated_at: datetime