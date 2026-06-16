import pandas as pd


def apply_feature_selection(
    df: pd.DataFrame,
    method: str,
    target_column: str | None = None
) -> pd.DataFrame:

    if (
        method == "none"
        or not target_column
        or target_column not in df.columns
    ):
        return df

    if method == "correlation":

        numerical_columns = (
            df.select_dtypes(include=["number"])
            .columns
            .tolist()
        )

        if target_column not in numerical_columns:
            return df

        correlation = (
            df[numerical_columns]
            .corr()[target_column]
            .abs()
        )

        selected_features = (
            correlation[
                correlation > 0.1
            ]
            .index
            .tolist()
        )

        if target_column not in selected_features:
            selected_features.append(
                target_column
            )

        return df[selected_features]

    return df