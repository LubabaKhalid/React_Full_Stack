# Cervical Cancer Biopsy Prediction App

This is a full stack ML web app that predicts the likelihood of a cervical cancer biopsy based on patient input.

## 🚀 Tech Stack

- Frontend: React js
- Backend: Flask + scikit-learn
- Database: MongoDB
- Containerization: Docker & Docker Compose

## 🔧 How to Run

1. Clone the repo:  https://github.com/yourusername/cervical-cancer-biopsy-app.git
  

2. Start the full stack:

   cd cervical-cancer-biopsy-app
   docker-compose up --build





3. Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: exposed on port 27017

## 📂 Project Structure

- `/backend`: Flask API with prediction logic
- `/frontend`: React form for input/prediction
- `analysis.ipynb`: Data preprocessing & model training
- `model.pkl`: Trained ML model
- `pipeline.pkl`: Preprocessing pipeline
- `docker-compose.yml`: Launch all services
