# consume enriched_news and publish notifications
import os, json, sys, hashlib
from confluent_kafka import Consumer, Producer

BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "redpanda:9092")
TOPIC_IN  = os.getenv("TOPIC_IN", "enriched_news")
TOPIC_OUT = os.getenv("TOPIC_OUT", "notifications")

print(f"[notifier] bootstrap={BOOTSTRAP} in={TOPIC_IN} out={TOPIC_OUT}")

p = Producer({"bootstrap.servers": BOOTSTRAP})
c = Consumer({
    "bootstrap.servers": BOOTSTRAP,
    "group.id": "notifier-group",
    "auto.offset.reset": "earliest",
})

def build_notification(enriched: dict) -> dict:
    news_id = enriched.get("id") or ""
    top_label = (enriched.get("labels") or [{"label":"Unknown","score":0.0}])[0]["label"]
    key = hashlib.sha1(news_id.encode()).hexdigest()[:12] if news_id else None
    return {
        "news_id": news_id,
        "title": enriched.get("title"),
        "top_label": top_label,
        "published_at": enriched.get("published_at"),
        "dedup_key": key
    }

def handle(msg_value: str):
    obj = json.loads(msg_value)
    notif = build_notification(obj)
    p.produce(TOPIC_OUT, json.dumps(notif).encode("utf-8"))
    p.flush()
    print(f"[notifier] -> {TOPIC_OUT} id={notif.get('news_id')} top={notif.get('top_label')}")

if __name__ == "__main__":
    c.subscribe([TOPIC_IN])
    try:
        while True:
            msg = c.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                print(f"[notifier] consume error: {msg.error()}", file=sys.stderr)
                continue
            handle(msg.value().decode("utf-8"))
    except KeyboardInterrupt:
        pass
    finally:
        c.close()
