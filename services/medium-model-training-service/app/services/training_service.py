import pandas as pd

from sklearn.ensemble import (
    RandomForestClassifier,
    RandomForestRegressor
)

from xgboost import (
    XGBClassifier,
    XGBRegressor
)

from app.services.evaluation_service import (
    evaluate_classification,
    evaluate_regression
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

    if model_type == "random_forest_classifier":

        model = RandomForestClassifier(
            n_estimators=100,
            random_state=42
        )

    elif model_type == "xgboost_classifier":

        model = XGBClassifier(
            random_state=42,
            eval_metric="logloss"
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

    if model_type == "random_forest_regressor":

        model = RandomForestRegressor(
            n_estimators=100,
            random_state=42
        )

    elif model_type == "xgboost_regressor":

        model = XGBRegressor(
            random_state=42
        )

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