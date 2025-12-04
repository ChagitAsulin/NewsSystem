FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app
COPY requirements.txt .
ENV PIP_DEFAULT_TIMEOUT=600

RUN pip install --upgrade pip && \
    pip install --no-cache-dir --index-url https://pypi.org/simple -r requirements.txt

COPY src ./src

CMD ["python","-m","src.publish"]
