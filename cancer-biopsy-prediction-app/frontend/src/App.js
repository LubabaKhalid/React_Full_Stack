// src/App.js
import React from "react";
import PredictionForm from "./components/PredictionForm";
import "./mainstyle.css";

function App() {
  return (
    <div className="app-container">
      <h1>Cervical Cancer Biopsy Prediction</h1>
      <PredictionForm />
    </div>
  );
}

export default App;
