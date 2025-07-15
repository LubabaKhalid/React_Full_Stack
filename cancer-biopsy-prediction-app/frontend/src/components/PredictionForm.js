import React, { useState } from "react";
import axios from "axios";
import "../mainstyle.css";

const initialData = {
  Age: 35,
  "Number of sexual partners": 3,
  "First sexual intercourse": 17,
  "Num of pregnancies": 2,
  Smokes: 1,
  "Smokes (years)": 5,
  "Smokes (packs/year)": 1,
  "Hormonal Contraceptives": 1,
  "Hormonal Contraceptives (years)": 2,
  IUD: 0,
  "IUD (years)": 0,
  STDs: 1,
  "STDs:condylomatosis": 0,
  "STDs:cervical condylomatosis": 0,
  "STDs:vaginal condylomatosis": 0,
  "STDs:vulvo-perineal condylomatosis": 0,
  "STDs:syphilis": 0,
  "STDs:pelvic inflammatory disease": 0,
  "STDs:genital herpes": 0,
  "STDs:molluscum contagiosum": 0,
  "STDs:AIDS": 0,
  "STDs:HIV": 0,
  "STDs:Hepatitis B": 0,
  "STDs:HPV": 0,
  "STDs: Time since first diagnosis": 1,
  "STDs: Time since last diagnosis": 1,
  "Dx:Cancer": 0,
  "Dx:CIN": 0,
  "Dx:HPV": 0,
  Dx: 0,
  Hinselmann: 0,
  Schiller: 0,
  Citology: 0
};

const PredictionForm = () => {
  const [formData, setFormData] = useState(initialData);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      setResult(res.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setResult({ error: "Prediction failed." });
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>🩺 Cervical Cancer Biopsy Prediction</h2>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key} className="form-group">
          <label>{key}</label>
          <input
            type="number"
            name={key}
            value={value}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit">Predict</button>

      {result && (
        <div className="result-card">
          {result.error ? (
            <p className="error">{result.error}</p>
          ) : (
            <>
              <h3>✅ Prediction Result</h3>
              <p><strong>Biopsy Prediction:</strong> {result.biopsy_prediction === 1 ? "Positive" : "Negative"}</p>
              <p><strong>Confidence Score:</strong> {result.confidence_score}</p>
            </>
          )}
        </div>
      )}
    </form>
  );
};

export default PredictionForm;
