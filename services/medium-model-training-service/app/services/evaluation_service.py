from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    silhouette_score
)


def evaluate_classification(
    y_true,
    y_pred
) -> dict:

    return {
        "accuracy": round(
            float(
                accuracy_score(
                    y_true,
                    y_pred
                )
            ),
            4
        ),
        "precision": round(
            float(
                precision_score(
                    y_true,
                    y_pred,
                    average="weighted",
                    zero_division=0
                )
            ),
            4
        ),
        "recall": round(
            float(
                recall_score(
                    y_true,
                    y_pred,
                    average="weighted",
                    zero_division=0
                )
            ),
            4
        ),
        "f1_score": round(
            float(
                f1_score(
                    y_true,
                    y_pred,
                    average="weighted",
                    zero_division=0
                )
            ),
            4
        )
    }


def evaluate_regression(
    y_true,
    y_pred
) -> dict:

    return {
        "mae": round(
            float(
                mean_absolute_error(
                    y_true,
                    y_pred
                )
            ),
            4
        ),
        "mse": round(
            float(
                mean_squared_error(
                    y_true,
                    y_pred
                )
            ),
            4
        ),
        "r2_score": round(
            float(
                r2_score(
                    y_true,
                    y_pred
                )
            ),
            4
        )
    }


def evaluate_clustering(
    X,
    labels
) -> dict:

    unique_labels = set(labels)

    if len(unique_labels) <= 1:
        return {
            "silhouette_score": None
        }

    return {
        "silhouette_score": round(
            float(
                silhouette_score(
                    X,
                    labels
                )
            ),
            4
        )
    }