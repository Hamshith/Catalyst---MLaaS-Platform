import pandas as pd

from sklearn.model_selection import (
    train_test_split
)


TEST_SIZE = 0.2
RANDOM_STATE = 42


def split_dataset(
    df: pd.DataFrame,
    target_column: str | None = None,
    learning_type: str | None = None,
    problem_type: str | None = None
):
    stratify = None

    if (
        learning_type == "supervised"
        and problem_type == "classification"
        and target_column
        and target_column in df.columns
    ):
        stratify = df[target_column]

    train_df, test_df = train_test_split(
        df,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=stratify
    )

    train_df = train_df.reset_index(
        drop=True
    )

    test_df = test_df.reset_index(
        drop=True
    )

    test_start_row = len(train_df)

    combined_df = pd.concat(
        [train_df, test_df],
        ignore_index=True
    )

    return {
        "combined_df": combined_df,
        "train_df": train_df,
        "test_df": test_df,
        "test_start_row": test_start_row
    }