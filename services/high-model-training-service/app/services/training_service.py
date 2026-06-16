import pandas as pd

from sklearn.svm import (
    SVC,
    SVR
)

from sklearn.cluster import (
    DBSCAN
)

from app.services.evaluation_service import (
    evaluate_classification,
    evaluate_regression,
    evaluate_clustering
)


def train_classification_model(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    target_column: str,
    model_type: str
):
    X_train = train_df.drop(
        columns=[target_column]
    )

    y_train = train_df[
        target_column
    ]

    X_test = test_df.drop(
        columns=[target_column]
    )

    y_test = test_df[
        target_column
    ]

    if model_type == "svm_classifier":

        model = SVC(
            probability=True,
            random_state=42
        )

    else:
        raise ValueError(
            f"Unsupported classification model: {model_type}"
        )

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    metrics = (
        evaluate_classification(
            y_test,
            predictions
        )
    )

    return model, metrics


def train_regression_model(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    target_column: str,
    model_type: str
):
    X_train = train_df.drop(
        columns=[target_column]
    )

    y_train = train_df[
        target_column
    ]

    X_test = test_df.drop(
        columns=[target_column]
    )

    y_test = test_df[
        target_column
    ]

    if model_type == "svr":

        model = SVR()

    else:
        raise ValueError(
            f"Unsupported regression model: {model_type}"
        )

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    metrics = (
        evaluate_regression(
            y_test,
            predictions
        )
    )

    return model, metrics


def train_unsupervised_model(
    df: pd.DataFrame,
    model_type: str
):
    if model_type == "dbscan":

        model = DBSCAN(
            eps=0.5,
            min_samples=5
        )

    else:
        raise ValueError(
            f"Unsupported unsupervised model: {model_type}"
        )

    labels = model.fit_predict(
        df
    )

    metrics = (
        evaluate_clustering(
            df,
            labels
        )
    )

    return model, metrics