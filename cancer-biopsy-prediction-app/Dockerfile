# Use an official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all backend files including model artifacts
COPY backend/ /app

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Expose Flask port
EXPOSE 5000

# Start the Flask app
CMD ["python", "app.py"]
