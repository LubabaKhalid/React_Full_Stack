import React, { useState } from "react";
import axios from "axios";
import "../mainstyle.css";

const initialData = {
  // 🧍 General Info
  Age: 35,
  "Number of sexual partners": 3,
  "First sexual intercourse": 17,
  "Num of pregnancies": 2,

  // 🔥 Smoking
  Smokes: 1,
  "Smokes (years)": 5,
  "Smokes (packs/year)": 1,

  // 💊 Contraceptives
  "Hormonal Contraceptives": 1,
  "Hormonal Contraceptives (years)": 2,
  IUD: 0,
  "IUD (years)": 0,

  // 🧫 STDs
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

  // 🧪 Diagnostics
  "Dx:Cancer": 0,
  "Dx:CIN": 0,
  "Dx:HPV": 0,
  Dx: 0,
  Hinselmann: 0,
  Schiller: 0,
  Citology: 0,
};

const sections = {
  general: ["Age", "Number of sexual partners", "First sexual intercourse", "Num of pregnancies"],
  smoking: ["Smokes", "Smokes (years)", "Smokes (packs/year)"],
  contraceptive: ["Hormonal Contraceptives", "Hormonal Contraceptives (years)", "IUD", "IUD (years)"],
  stds: [
    "STDs", "STDs:condylomatosis", "STDs:cervical condylomatosis", "STDs:vaginal condylomatosis",
    "STDs:vulvo-perineal condylomatosis", "STDs:syphilis", "STDs:pelvic inflammatory disease",
    "STDs:genital herpes", "STDs:molluscum contagiosum", "STDs:AIDS", "STDs:HIV",
    "STDs:Hepatitis B", "STDs:HPV", "STDs: Time since first diagnosis", "STDs: Time since last diagnosis"
  ],
  diagnostics: ["Dx:Cancer", "Dx:CIN", "Dx:HPV", "Dx", "Hinselmann", "Schiller", "Citology"],
};

const PredictionForm = () => {
  const [formData, setFormData] = useState(initialData);
  const [result, setResult] = useState(null);
  const [activeSection, setActiveSection] = useState("general");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = Number(value);
    if (val < 0) return; 
    setFormData({ ...formData, [name]: val });
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
    <form className="form-container animate-slide" onSubmit={handleSubmit}>
      <h2>🩺 Cervical Cancer Biopsy Prediction</h2>

      {/* 🔘 Section Buttons */}
      <div className="section-buttons">
        {Object.keys(sections).map((sectionKey) => (
          <button
            key={sectionKey}
            type="button"
            className={activeSection === sectionKey ? "active" : ""}
            onClick={() => setActiveSection(sectionKey)}
          >
            {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
          </button>
        ))}
      </div>

      {/* 👇 Fields for Active Section */}
      <div className="form-grid animate-fade">
        {sections[activeSection].map((fieldName) => (
          <div key={fieldName} className="form-group">
            <label>{fieldName}</label>
            <input
              type="number"
              name={fieldName}
              value={formData[fieldName]}
              min={0}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <button type="submit">🔍 Predict</button>

      {result && (
        <div className="result-card animate-fade">
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
