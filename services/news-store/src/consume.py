import os
import json
import sys
from typing import Any, Dict

from confluent_kafka import Consumer
import firebase_admin
from firebase_admin import credentials, firestore

# ---- Kafka config ----
BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "redpanda:9092")
TOPIC_IN  = os.getenv("TOPIC_IN", "enriched_news")

# ---- Firebase config ----
CRED_PATH   = os.getenv("FIREBASE_CREDENTIALS", "/app/firebase-key.json")
PROJECT_ID  = os.getenv("FIREBASE_PROJECT_ID")
COLLECTION  = os.getenv("FIREBASE_COLLECTION", "news")

print(f"[news-store] bootstrap={BOOTSTRAP} topic_in={TOPIC_IN} project={PROJECT_ID} collection={COLLECTION}")

# ---- Init Firebase ----
cred = credentials.Certificate(CRED_PATH)
firebase_admin.initialize_app(cred, {"projectId": PROJECT_ID})
db = firestore.client()

def save_news(doc: Dict[str, Any]) -> None:
    """
    שומר את הידיעה ל-Firestore במסמך עם id ייחודי.
    """
    news_id = str(doc.get("id") or doc.get("news_id") or "")
    if not news_id:
        # אם מסיבה כלשהי אין id – ניצור אחד אוטומטית
        from uuid import uuid4
        news_id = str(uuid4())
        doc["id"] = news_id

    # אפשר להוסיף timestamp אם לא קיים
    import time
    doc.setdefault("created_at", firestore.SERVER_TIMESTAMP)

    db.collection(COLLECTION).document(news_id).set(doc)

def main():
    c = Consumer({
        "bootstrap.servers": BOOTSTRAP,
        "group.id": "news-store-group",
        "auto.offset.reset": "earliest",
    })

    c.subscribe([TOPIC_IN])
    print("[news-store] listening for enriched news...")

    try:
        while True:
            msg = c.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                print(f"[news-store] consume error: {msg.error()}", file=sys.stderr)
                continue

            try:
                obj = json.loads(msg.value().decode("utf-8"))
                save_news(obj)
                print(f"[news-store] saved news id={obj.get('id')}")
            except Exception as e:
                print(f"[news-store] error saving news: {e}", file=sys.stderr)

    except KeyboardInterrupt:
        pass
    finally:
        c.close()

if __name__ == "__main__":
    main()
