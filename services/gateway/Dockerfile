
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
ENV PIP_DEFAULT_TIMEOUT=600

RUN pip install --upgrade pip && \
    pip install --no-cache-dir --index-url https://pypi.org/simple -r requirements.txt
COPY app ./app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
