export const REQUEST_STATUS = {
  QUEUED: 'queued',
  PREPROCESSING: 'preprocessing',
  TRAINING: 'training',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const REQUEST_STATUS_OPTIONS = [
  { value: 'queued', label: 'Queued' },
  { value: 'preprocessing', label: 'Preprocessing' },
  { value: 'training', label: 'Training' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

export const LEARNING_TYPE = {
  SUPERVISED: 'supervised',
  UNSUPERVISED: 'unsupervised',
};

export const LEARNING_TYPE_OPTIONS = [
  { value: 'supervised', label: 'Supervised Learning' },
  { value: 'unsupervised', label: 'Unsupervised Learning' },
];

export const PROBLEM_TYPE = {
  CLASSIFICATION: 'classification',
  REGRESSION: 'regression',
};

export const PROBLEM_TYPE_OPTIONS = [
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Regression' },
];

export const CLASSIFICATION_MODELS = {
  LOGISTIC_REGRESSION: 'logistic_regression',
  RANDOM_FOREST_CLASSIFIER: 'random_forest_classifier',
  XGBOOST_CLASSIFIER: 'xgboost_classifier',
  SVM_CLASSIFIER: 'svm_classifier',
};

export const CLASSIFICATION_MODEL_OPTIONS = [
  { value: 'logistic_regression', label: 'Logistic Regression', tier: 'Low' },
  { value: 'random_forest_classifier', label: 'Random Forest Classifier', tier: 'Medium' },
  { value: 'xgboost_classifier', label: 'XGBoost Classifier', tier: 'Medium' },
  { value: 'svm_classifier', label: 'SVM Classifier', tier: 'High' },
];

export const REGRESSION_MODELS = {
  LINEAR_REGRESSION: 'linear_regression',
  RANDOM_FOREST_REGRESSOR: 'random_forest_regressor',
  XGBOOST_REGRESSOR: 'xgboost_regressor',
  SVR: 'svr',
};

export const REGRESSION_MODEL_OPTIONS = [
  { value: 'linear_regression', label: 'Linear Regression', tier: 'Low' },
  { value: 'random_forest_regressor', label: 'Random Forest Regressor', tier: 'Medium' },
  { value: 'xgboost_regressor', label: 'XGBoost Regressor', tier: 'Medium' },
  { value: 'svr', label: 'SVR', tier: 'High' },
];

export const UNSUPERVISED_MODELS = {
  KMEANS: 'kmeans',
  DBSCAN: 'dbscan',
};

export const UNSUPERVISED_MODEL_OPTIONS = [
  { value: 'kmeans', label: 'KMeans', tier: 'Low' },
  { value: 'dbscan', label: 'DBSCAN', tier: 'High' },
];

export const MISSING_VALUE_STRATEGIES = {
  NONE: 'none',
  MEAN: 'mean',
  MEDIAN: 'median',
  MODE: 'mode',
};

export const MISSING_VALUE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'mean', label: 'Mean' },
  { value: 'median', label: 'Median' },
  { value: 'mode', label: 'Mode' },
];

export const ENCODING_METHODS = {
  NONE: 'none',
  LABEL: 'label',
  ONE_HOT: 'one_hot',
};

export const ENCODING_METHOD_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'label', label: 'Label Encoding' },
  { value: 'one_hot', label: 'One-Hot Encoding' },
];

export const FEATURE_SELECTION_METHODS = {
  NONE: 'none',
  CORRELATION: 'correlation',
};

export const FEATURE_SELECTION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'correlation', label: 'Correlation-Based' },
];

export const SCALING_METHODS = {
  NONE: 'none',
  STANDARD: 'standard',
  MINMAX: 'minmax',
  ROBUST: 'robust',
};

export const SCALING_METHOD_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'standard', label: 'Standard Scaler' },
  { value: 'minmax', label: 'Min-Max Scaler' },
  { value: 'robust', label: 'Robust Scaler' },
];

export const STATUS_COLORS = {
  queued: 'bg-info-light text-info',
  preprocessing: 'bg-warning-light text-warning',
  training: 'bg-secondary-light text-secondary',
  completed: 'bg-success-light text-success',
  failed: 'bg-danger-light text-danger',
};

export const MODEL_TIER_MAP = {
  logistic_regression: 'Low',
  linear_regression: 'Low',
  kmeans: 'Low',
  random_forest_classifier: 'Medium',
  random_forest_regressor: 'Medium',
  xgboost_classifier: 'Medium',
  xgboost_regressor: 'Medium',
  svm_classifier: 'High',
  svr: 'High',
  dbscan: 'High',
};

export const MODEL_DISPLAY_NAMES = {
  logistic_regression: 'Logistic Regression',
  linear_regression: 'Linear Regression',
  kmeans: 'KMeans',
  random_forest_classifier: 'Random Forest Classifier',
  random_forest_regressor: 'Random Forest Regressor',
  xgboost_classifier: 'XGBoost Classifier',
  xgboost_regressor: 'XGBoost Regressor',
  svm_classifier: 'SVM Classifier',
  svr: 'SVR',
  dbscan: 'DBSCAN',
};
