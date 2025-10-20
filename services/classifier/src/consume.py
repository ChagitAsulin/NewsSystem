# consume raw_news, classify, publish classified_news
import os, json, sys
from confluent_kafka import Consumer, Producer
from transformers import pipeline

BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "redpanda:9092")
TOPIC_IN  = os.getenv("TOPIC_IN", "raw_news")
TOPIC_OUT = os.getenv("TOPIC_OUT", "classified_news")
LABELS    = os.getenv("CLASSIFIER_LABELS", "Politics,Sports,Tech,Business,World").split(",")

print(f"[classifier] bootstrap={BOOTSTRAP} in={TOPIC_IN} out={TOPIC_OUT} labels={LABELS}")

clf = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
p = Producer({"bootstrap.servers": BOOTSTRAP})
c = Consumer({
    "bootstrap.servers": BOOTSTRAP,
    "group.id": "classifier-group",
    "auto.offset.reset": "earliest",
})

def handle(msg_value: str):
    obj = json.loads(msg_value)
    title = obj.get("title") or obj.get("content") or ""
    res = clf(title, candidate_labels=LABELS)
    # הוסף שדות סיווג
    obj["labels"] = [{"label": l, "score": float(s)} for l, s in zip(res["labels"], res["scores"])]
    p.produce(TOPIC_OUT, json.dumps(obj).encode("utf-8"))
    p.flush()
    print(f"[classifier] -> {TOPIC_OUT} id={obj.get('id')} top={obj['labels'][0]['label']}")

if __name__ == "__main__":
    c.subscribe([TOPIC_IN])
    try:
        while True:
            msg = c.poll(1.0)
            if msg is None: 
                continue
            if msg.error():
                print(f"[classifier] consume error: {msg.error()}", file=sys.stderr)
                continue
            handle(msg.value().decode("utf-8"))
    except KeyboardInterrupt:
        pass
    finally:
        c.close()
