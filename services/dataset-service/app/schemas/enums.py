from enum import Enum


class MissingValueStrategy(str, Enum):
    MEAN = "mean"
    MEDIAN = "median"
    MODE = "mode"
    NONE = "none"


class EncodingMethod(str, Enum):
    NONE = "none"
    LABEL = "label"
    ONE_HOT = "one_hot"


class FeatureSelectionMethod(str, Enum):
    NONE = "none"
    CORRELATION = "correlation"


class ScalingMethod(str, Enum):
    NONE = "none"
    STANDARD = "standard"
    MINMAX = "minmax"
    ROBUST = "robust"


class RequestStatus(str, Enum):
    QUEUED = "queued"
    PREPROCESSING = "preprocessing"
    TRAINING = "training"
    COMPLETED = "completed"
    FAILED = "failed"


class LearningType(str, Enum):
    SUPERVISED = "supervised"
    UNSUPERVISED = "unsupervised"


class ProblemType(str, Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"


class ClassificationModelType(str, Enum):
    LOGISTIC_REGRESSION = "logistic_regression"
    RANDOM_FOREST_CLASSIFIER = "random_forest_classifier"
    XGBOOST_CLASSIFIER = "xgboost_classifier"
    SVM_CLASSIFIER = "svm_classifier"


class RegressionModelType(str, Enum):
    LINEAR_REGRESSION = "linear_regression"
    RANDOM_FOREST_REGRESSOR = "random_forest_regressor"
    XGBOOST_REGRESSOR = "xgboost_regressor"
    SVR = "svr"


class UnsupervisedModelType(str, Enum):
    KMEANS = "kmeans"
    DBSCAN = "dbscan"