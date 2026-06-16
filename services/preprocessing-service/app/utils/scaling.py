import pandas as pd

from sklearn.preprocessing import (
    StandardScaler,
    MinMaxScaler,
    RobustScaler
)


def apply_scaling(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    method: str,
    target_column: str | None = None
):
    if method == "none":
        return train_df, test_df

    numerical_columns = (
        train_df.select_dtypes(include=["number"])
        .columns
        .tolist()
    )

    if (
        target_column
        and target_column in numerical_columns
    ):
        numerical_columns.remove(
            target_column
        )

    if not numerical_columns:
        return train_df, test_df

    scaler = None

    if method == "standard":
        scaler = StandardScaler()

    elif method == "minmax":
        scaler = MinMaxScaler()

    elif method == "robust":
        scaler = RobustScaler()

    if scaler:

        train_df[numerical_columns] = (
            scaler.fit_transform(
                train_df[numerical_columns]
            )
        )

        test_df[numerical_columns] = (
            scaler.transform(
                test_df[numerical_columns]
            )
        )

    return train_df, test_df