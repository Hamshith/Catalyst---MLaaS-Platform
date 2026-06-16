import pandas as pd


def generate_profile(file_path: str) -> dict:
    df = pd.read_csv(file_path)

    rows, columns = df.shape

    column_names = df.columns.tolist()

    numerical_column_names = (
        df.select_dtypes(include=["number"])
        .columns
        .tolist()
    )

    categorical_column_names = (
        df.select_dtypes(exclude=["number"])
        .columns
        .tolist()
    )

    numerical_columns = len(
        numerical_column_names
    )

    categorical_columns = len(
        categorical_column_names
    )

    total_cells = rows * columns

    missing_percentage = (
        round(
            (
                df.isnull().sum().sum()
                / total_cells
            ) * 100,
            2
        )
        if total_cells > 0
        else 0
    )

    missing_values_per_column = {
        column: int(count)
        for column, count in (
            df.isnull()
            .sum()
            .to_dict()
            .items()
        )
    }

    column_metadata = []

    for column in df.columns:
        column_metadata.append(
            {
                "name": column,
                "dtype": str(df[column].dtype),
                "unique_values": int(
                    df[column].nunique(dropna=True)
                ),
                "missing_count": int(
                    df[column].isnull().sum()
                )
            }
        )

    return {
        "rows": rows,
        "columns": columns,

        "column_names": column_names,

        "numerical_columns": numerical_columns,
        "categorical_columns": categorical_columns,

        "numerical_column_names": numerical_column_names,
        "categorical_column_names": categorical_column_names,

        "missing_percentage": missing_percentage,

        "missing_values_per_column": (
            missing_values_per_column
        ),

        "column_metadata": column_metadata
    }