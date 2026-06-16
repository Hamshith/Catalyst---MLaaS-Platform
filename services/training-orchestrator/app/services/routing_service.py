def determine_training_tier(
    request: dict
) -> str:

    learning_type = request.get(
        "learning_type"
    )

    problem_type = request.get(
        "problem_type"
    )

    classification_model = request.get(
        "classification_model"
    )

    regression_model = request.get(
        "regression_model"
    )

    unsupervised_model = request.get(
        "unsupervised_model"
    )

    low_models = {
        "logistic_regression",
        "linear_regression",
        "kmeans"
    }

    medium_models = {
        "random_forest_classifier",
        "random_forest_regressor",
        "xgboost_classifier",
        "xgboost_regressor"
    }

    high_models = {
        "svm_classifier",
        "svr",
        "dbscan"
    }

    if learning_type == "unsupervised":
        model = unsupervised_model

    elif problem_type == "classification":
        model = classification_model

    else:
        model = regression_model

    if model in low_models:
        return "low"

    if model in medium_models:
        return "medium"

    if model in high_models:
        return "high"

    raise ValueError(
        f"Unsupported model type: {model}"
    )