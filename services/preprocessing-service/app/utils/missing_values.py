import pandas as pd


def handle_missing_values(
    df: pd.DataFrame,
    strategy: str
) -> pd.DataFrame:

    numerical_columns = (
        df.select_dtypes(include=["number"])
        .columns
    )

    categorical_columns = (
        df.select_dtypes(exclude=["number"])
        .columns
    )

    if strategy == "none":
        return df

    elif strategy == "mean":
        for column in numerical_columns:
            df[column] = df[column].fillna(
                df[column].mean()
            )

    elif strategy == "median":
        for column in numerical_columns:
            df[column] = df[column].fillna(
                df[column].median()
            )

    elif strategy == "mode":
        for column in df.columns:
            mode = df[column].mode()

            if not mode.empty:
                df[column] = df[column].fillna(
                    mode[0]
                )

    return df