import pandas as pd

from sklearn.linear_model import (
    LogisticRegression,
    LinearRegression
)

from sklearn.cluster import (
    KMeans
)

from app.services.evaluation_service import (
    evaluate_classification,
    evaluate_regression,
    evaluate_clustering
)


def train_classification_model(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    target_column: str
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

    model = LogisticRegression(
        max_iter=1000
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
    target_column: str
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

    model = LinearRegression()

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
    df: pd.DataFrame
):
    model = KMeans(
        n_clusters=3,
        random_state=42
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