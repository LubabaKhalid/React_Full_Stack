from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from pymongo import MongoClient
import traceback
import os
import pickle

app = Flask(__name__)
CORS(app)

print("✅ Starting Flask API...")

try:
    model = joblib.load('model.pkl')
    pipeline = joblib.load('pipeline.pkl')
    print("✅ Model and pipeline loaded successfully.")
except Exception as e:
    print("❌ Error loading model or pipeline:", str(e))
    traceback.print_exc()
    exit(1)  # <--- This will stop the app if loading fails


# MongoDB setup
try:
    mongo_url = "mongodb+srv://lubabalubaba815:fcit123%2A%23@nexium-mongo.jyskrvu.mongodb.net/biopsy_db?retryWrites=true&w=majority"

    client = MongoClient(mongo_url)

    db = client['biopsy_db']
    predictions_col = db['predictions']
    client.server_info()
    print("✅ Connected to MongoDB.")
except Exception as e:
    print("❌ MongoDB connection failed:", str(e))
    predictions_col = None

# Column order for model input
FEATURE_ORDER = [
    "Age", "Number of sexual partners", "First sexual intercourse", "Num of pregnancies",
    "Smokes", "Smokes (years)", "Smokes (packs/year)",
    "Hormonal Contraceptives", "Hormonal Contraceptives (years)",
    "IUD", "IUD (years)", "STDs",
    "STDs:condylomatosis", "STDs:cervical condylomatosis", "STDs:vaginal condylomatosis",
    "STDs:vulvo-perineal condylomatosis", "STDs:syphilis", "STDs:pelvic inflammatory disease",
    "STDs:genital herpes", "STDs:molluscum contagiosum", "STDs:AIDS", "STDs:HIV",
    "STDs:Hepatitis B", "STDs:HPV",
    "STDs: Time since first diagnosis", "STDs: Time since last diagnosis",
    "Dx:Cancer", "Dx:CIN", "Dx:HPV", "Dx",
    "Hinselmann", "Schiller", "Citology",
    "STDs (number)", "STDs: Number of diagnosis", "Total_STDs"
]

@app.route('/')
def home():
    return jsonify({"message": "API is live"})


@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.get_json()
        input_df = pd.DataFrame([input_data])

        # Add required features
        std_features = [
            "STDs:condylomatosis", "STDs:cervical condylomatosis", "STDs:vaginal condylomatosis",
            "STDs:vulvo-perineal condylomatosis", "STDs:syphilis", "STDs:pelvic inflammatory disease",
            "STDs:genital herpes", "STDs:molluscum contagiosum", "STDs:AIDS", "STDs:HIV",
            "STDs:Hepatitis B", "STDs:HPV"
        ]

        input_df["STDs: Number of diagnosis"] = input_df[std_features].sum(axis=1)
        input_df["STDs (number)"] = input_df["STDs: Number of diagnosis"]
        input_df["Total_STDs"] = input_df[std_features].sum(axis=1)

        # Reorder to match model input
        # Enforce column order from the pipeline (safe and dynamic)
        expected_columns = pipeline.feature_names_in_
        input_df = input_df.reindex(columns=expected_columns)


        # Preprocess and predict
        input_scaled = pipeline.transform(input_df)
        proba = model.predict_proba(input_scaled)[0]
        pred = int(model.predict(input_scaled)[0])
        confidence = float(proba[pred])

        # Log to MongoDB
        if predictions_col is not None:

            predictions_col.insert_one({
                **input_data,
                "biopsy_prediction": pred,
                "confidence_score": confidence
            })

        return jsonify({
            "biopsy_prediction": pred,
            "confidence_score": round(confidence, 4)
        })

    except Exception as e:
        print("❌ Error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("🚀 Flask server running at http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
