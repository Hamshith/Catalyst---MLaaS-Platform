import pandas as pd

from sklearn.decomposition import PCA


def apply_pca(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    target_column: str | None = None,
    n_components: float = 0.95
):
    train_target = None
    test_target = None

    if (
        target_column
        and target_column in train_df.columns
    ):
        train_target = train_df[target_column]
        test_target = test_df[target_column]

        train_features = train_df.drop(
            columns=[target_column]
        )

        test_features = test_df.drop(
            columns=[target_column]
        )

    else:
        train_features = train_df
        test_features = test_df

    numerical_columns = (
        train_features.select_dtypes(
            include=["number"]
        ).columns.tolist()
    )

    if len(numerical_columns) < 2:
        return train_df, test_df

    pca = PCA(
        n_components=n_components
    )

    train_transformed = pca.fit_transform(
        train_features[numerical_columns]
    )

    test_transformed = pca.transform(
        test_features[numerical_columns]
    )

    train_pca_df = pd.DataFrame(
        train_transformed,
        columns=[
            f"PC{i + 1}"
            for i in range(
                train_transformed.shape[1]
            )
        ]
    )

    test_pca_df = pd.DataFrame(
        test_transformed,
        columns=[
            f"PC{i + 1}"
            for i in range(
                test_transformed.shape[1]
            )
        ]
    )

    if train_target is not None:
        train_pca_df[target_column] = (
            train_target.reset_index(
                drop=True
            )
        )

        test_pca_df[target_column] = (
            test_target.reset_index(
                drop=True
            )
        )

    return train_pca_df, test_pca_df