import os
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import Counter

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# Paths
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# --------------------------------------------------
# Load models & preprocessors
# --------------------------------------------------
svm = joblib.load(os.path.join(MODELS_DIR, "svm.pkl"))
rf = joblib.load(os.path.join(MODELS_DIR, "rf.pkl"))
xgb = joblib.load(os.path.join(MODELS_DIR, "xgb.pkl"))
scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
imputer = joblib.load(os.path.join(MODELS_DIR, "imputer.pkl"))

# --------------------------------------------------
# Health check
# --------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Pancreatic Cancer Prediction API is running"})

# --------------------------------------------------
# Prediction API (AUTO MODEL SELECTION)
# --------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("REQUEST JSON:", data)

        features = np.array(data["features"]).reshape(1, -1)

        # Preprocessing
        features = imputer.transform(features)
        features = scaler.transform(features)

        results = {}

        # ---------------- SVM ----------------
        try:
            svm_pred = int(svm.predict(features)[0])
            if hasattr(svm, "predict_proba"):
                svm_conf = float(max(svm.predict_proba(features)[0]))
            else:
                svm_conf = 0.0
            results["SVM"] = (svm_pred, svm_conf)
        except:
            pass

        # ----------- Random Forest ------------
        rf_pred = int(rf.predict(features)[0])
        rf_conf = float(max(rf.predict_proba(features)[0]))
        results["Random Forest"] = (rf_pred, rf_conf)

        # -------------- XGBoost ---------------
        xgb_pred = int(xgb.predict(features)[0])
        xgb_conf = float(max(xgb.predict_proba(features)[0]))
        results["XGBoost"] = (xgb_pred, xgb_conf)

        # -------- SELECT BEST MODEL ----------
        best_model = max(results.items(), key=lambda x: x[1][1])[0]
        final_prediction, final_confidence = results[best_model]

        return jsonify({
            "prediction": int(final_prediction),
            "best_model": best_model,
            "confidence": float(round(final_confidence, 3))
        })

    except Exception as e:
        print("BACKEND ERROR:", str(e))
        return jsonify({"error": str(e)}), 500



# --------------------------------------------------
# Run server
# --------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)

