FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY src/ ./src/

# Expose port (default Django port)
EXPOSE 8000

# Start server
CMD ["python", "src/manage.py", "runserver", "0.0.0.0:8000"]
