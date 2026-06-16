import pandas as pd

from sklearn.model_selection import train_test_split


MIN_SAMPLE_SIZE = 1000
SAMPLE_PERCENTAGE = 0.20


def sample_dataset(
    df: pd.DataFrame,
    target_column: str | None = None,
    problem_type: str | None = None
) -> pd.DataFrame:

    total_rows = len(df)

    sample_size = max(
        MIN_SAMPLE_SIZE,
        int(total_rows * SAMPLE_PERCENTAGE)
    )

    sample_size = min(
        sample_size,
        total_rows
    )

    if sample_size == total_rows:
        return df

    if (
        problem_type == "classification"
        and target_column
        and target_column in df.columns
    ):
        sampled_df, _ = train_test_split(
            df,
            train_size=sample_size,
            stratify=df[target_column],
            random_state=42
        )

        return sampled_df.reset_index(
            drop=True
        )

    return df.sample(
        n=sample_size,
        random_state=42
    ).reset_index(
        drop=True
    )