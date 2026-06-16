import pandas as pd

from imblearn.over_sampling import (
    RandomOverSampler
)


def balance_dataset(
    df: pd.DataFrame,
    target_column: str | None = None
) -> pd.DataFrame:

    if (
        not target_column
        or target_column not in df.columns
    ):
        return df

    X = df.drop(
        columns=[target_column]
    )

    y = df[target_column]

    sampler = RandomOverSampler(
        random_state=42
    )

    X_resampled, y_resampled = (
        sampler.fit_resample(
            X,
            y
        )
    )

    balanced_df = X_resampled.copy()

    balanced_df[target_column] = (
        y_resampled
    )

    return balanced_df