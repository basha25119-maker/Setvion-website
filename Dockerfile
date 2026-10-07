# Stage 1: build the React app
FROM node:22-alpine AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: tiny Python image that serves the build + API
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
COPY --from=web /web/dist ./frontend/dist
RUN useradd -m app && chown -R app /app
USER app
# Railway injects $PORT
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-8080} --workers 2 --threads 4 --timeout 30 --access-logfile -"]
