# Use Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy contents of backend folder into container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

#Python 3.13.5
#pip 24.0
#C:\Users\PMLS\AppData\Local\Programs\Python\Python311\python.exe app.py

# Expose Flask port
EXPOSE 5000

# Start the Flask app
CMD ["python", "app.py"]
