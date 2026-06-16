import pandas as pd

from app.utils.sampling import (
    sample_dataset
)

from app.utils.missing_values import (
    handle_missing_values
)

from app.utils.encoding import (
    apply_encoding
)

from app.utils.feature_selection import (
    apply_feature_selection
)

from app.utils.data_balancing import (
    balance_dataset
)

from app.utils.train_test_splitter import (
    split_dataset
)

from app.utils.scaling import (
    apply_scaling
)

from app.utils.pca import (
    apply_pca
)


def preprocess_dataset(
    input_file: str,
    output_file: str,
    request: dict
):
    df = pd.read_csv(input_file)

    # Sampling
    df = sample_dataset(
        df,
        request.get("target_column"),
        request.get("problem_type")
    )

    # Missing Values
    df = handle_missing_values(
        df,
        request["missing_value_strategy"]
    )

    # Encoding
    df = apply_encoding(
        df,
        request["encoding_method"],
        request.get("target_column")
    )

    # Feature Selection
    df = apply_feature_selection(
        df,
        request["feature_selection_method"],
        request.get("target_column")
    )

    # Balance Classification Dataset
    if (
        request.get("learning_type") == "supervised"
        and request.get("problem_type") == "classification"
    ):
        df = balance_dataset(
            df,
            request.get("target_column")
        )

    # Train-Test Split
    split_result = split_dataset(
        df,
        request.get("target_column"),
        request.get("learning_type"),
        request.get("problem_type")
    )

    train_df = split_result["train_df"]
    test_df = split_result["test_df"]

    # Scaling
    train_df, test_df = apply_scaling(
        train_df,
        test_df,
        request["scaling_method"],
        request.get("target_column")
    )

    # PCA
    if request.get("pca"):
        train_df, test_df = apply_pca(
            train_df,
            test_df,
            request.get("target_column")
        )

    # Merge Back
    combined_df = pd.concat(
        [train_df, test_df],
        ignore_index=True
    )

    test_start_row = len(train_df)

    combined_df.to_csv(
        output_file,
        index=False
    )

    return {
        "output_file": output_file,
        "test_start_row": test_start_row
    }