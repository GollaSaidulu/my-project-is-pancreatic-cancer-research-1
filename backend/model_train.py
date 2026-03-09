import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

# --------------------------------------------------
# Load dataset using absolute path
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "Debernardi_et_al_2020.csv")

print("Looking for dataset at:", DATASET_PATH)

data = pd.read_csv(DATASET_PATH)

# --------------------------------------------------
# Separate target and features
# --------------------------------------------------
# Change column name ONLY if your CSV uses a different target
TARGET_COLUMN = "diagnosis"

y = data[TARGET_COLUMN]
# --------------------------------------------------
# Encode target labels to start from 0
# (XGBoost requirement)
# --------------------------------------------------
y = y.astype(int)
y = y - y.min()

X = data.drop(TARGET_COLUMN, axis=1)

# --------------------------------------------------
# Remove non-numeric columns (like patient IDs: S52)
# --------------------------------------------------
X = X.select_dtypes(include=["int64", "float64"])

# --------------------------------------------------
# Handle missing values (NaN)
# --------------------------------------------------
imputer = SimpleImputer(strategy="mean")
X = imputer.fit_transform(X)

# --------------------------------------------------
# Train-test split
# --------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# --------------------------------------------------
# Feature scaling
# --------------------------------------------------
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# --------------------------------------------------
# Models
# --------------------------------------------------
svm = SVC(
    kernel="rbf",
    probability=True,   # ✅ REQUIRED
    random_state=42
)
rf = RandomForestClassifier(n_estimators=100, random_state=42)
xgb = XGBClassifier(eval_metric="logloss")

# --------------------------------------------------
# Train models
# --------------------------------------------------
svm.fit(X_train, y_train)
rf.fit(X_train, y_train)
xgb.fit(X_train, y_train)

# --------------------------------------------------
# Save models
# --------------------------------------------------
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

joblib.dump(svm, os.path.join(MODELS_DIR, "svm.pkl"))
joblib.dump(rf, os.path.join(MODELS_DIR, "rf.pkl"))
joblib.dump(xgb, os.path.join(MODELS_DIR, "xgb.pkl"))
joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))
joblib.dump(imputer, os.path.join(MODELS_DIR, "imputer.pkl"))

print("✅ Models trained & saved successfully")
