def build_recommendation_prompt(
    dataset: dict,
    goal: str | None = None,
    target_column: str | None = None
) -> str:

    profile = dataset.get("profile", {})

    prompt = f"""
You are an expert AutoML recommendation engine.

Analyze the dataset metadata and recommend the most appropriate machine learning pipeline.

Dataset Information:
- Rows: {profile.get("rows")}
- Columns: {profile.get("columns")}
- Column Names: {profile.get("column_names")}
- Numerical Columns: {profile.get("numerical_column_names")}
- Categorical Columns: {profile.get("categorical_column_names")}
- Missing Percentage: {profile.get("missing_percentage")}
- Missing Values Per Column: {profile.get("missing_values_per_column")}
- Column Metadata: {profile.get("column_metadata")}

User Goal:
{goal or "Not provided"}

Target Column Hint:
{target_column or "Not provided"}

Available Learning Types:
- supervised
- unsupervised

Available Problem Types:
- classification
- regression

Available Missing Value Strategies:
- mean
- median
- mode

Available Encoding Methods:
- none
- label
- one_hot

Available Feature Selection Methods:
- none
- correlation

Available Scaling Methods:
- none
- standard
- minmax
- robust

Available Classification Models:
- logistic_regression
- random_forest_classifier
- xgboost_classifier
- svm_classifier

Available Regression Models:
- linear_regression
- random_forest_regressor
- xgboost_regressor
- svr

Available Unsupervised Models:
- kmeans
- dbscan

Rules:
1. Select exactly one learning_type.
2. If learning_type is supervised, select:
   - problem_type
   - target_column
   - either classification_model or regression_model
3. If learning_type is unsupervised:
   - problem_type must be null
   - target_column must be null
   - select unsupervised_model
4. Use only the values listed above.
5. Explain your recommendations.

Return ONLY valid JSON in the following format:

{{
  "learning_type": "",
  "problem_type": "",
  "target_column": "",
  "missing_value_strategy": "",
  "encoding_method": "",
  "feature_selection_method": "",
  "scaling_method": "",
  "pca": false,
  "classification_model": null,
  "regression_model": null,
  "unsupervised_model": null,
  "reasoning": [
    "",
    ""
  ]
}}
"""

    return prompt