import pandas as pd

from sklearn.preprocessing import LabelEncoder


def apply_encoding(
    df: pd.DataFrame,
    method: str,
    target_column: str | None = None
) -> pd.DataFrame:

    categorical_columns = (
        df.select_dtypes(exclude=["number"])
        .columns
        .tolist()
    )

    feature_categorical_columns = [
        column
        for column in categorical_columns
        if column != target_column
    ]

    if (
        method == "none"
        and feature_categorical_columns
    ):
        raise ValueError(
            "Dataset contains categorical feature columns. "
            "Encoding method cannot be 'none'."
        )

    if method == "label":

        for column in feature_categorical_columns:
            encoder = LabelEncoder()

            df[column] = encoder.fit_transform(
                df[column].astype(str)
            )

    elif method == "one_hot":

        df = pd.get_dummies(
            df,
            columns=feature_categorical_columns,
            drop_first=True
        )

    elif method != "none":
        raise ValueError(
            f"Unsupported encoding method: {method}"
        )

    # Always encode target column if it is categorical
    # This ensures compatibility with XGBoost, SVM, etc.
    if (
        target_column
        and target_column in df.columns
        and not pd.api.types.is_numeric_dtype(
            df[target_column]
        )
    ):
        encoder = LabelEncoder()

        df[target_column] = (
            encoder.fit_transform(
                df[target_column].astype(str)
            )
        )

    return df