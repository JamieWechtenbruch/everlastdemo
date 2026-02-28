FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY agent.py .

ENV PYTHONUNBUFFERED=1
ENV BACKEND_URL=http://backend:8000

CMD ["python", "agent.py", "start"]
