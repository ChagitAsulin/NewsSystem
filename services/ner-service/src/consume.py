import os, json, sys
from confluent_kafka import Consumer, Producer
from transformers import pipeline

BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "redpanda:9092")
TOPIC_IN  = os.getenv("TOPIC_IN", "classified_news")
TOPIC_OUT = os.getenv("TOPIC_OUT", "enriched_news")

print(f"[ner] bootstrap={BOOTSTRAP} in={TOPIC_IN} out={TOPIC_OUT}")

ner = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
p = Producer({"bootstrap.servers": BOOTSTRAP})
c = Consumer({
    "bootstrap.servers": BOOTSTRAP,
    "group.id": "ner-group",
    "auto.offset.reset": "earliest",
})

def handle(msg_value: str):
    obj = json.loads(msg_value)
    text = (obj.get("title") or "") + ". " + (obj.get("content") or "")
    ents = ner(text) or []
    obj["entities"] = [{"type": e.get("entity_group"), "text": e.get("word"), "score": float(e.get("score",0))} for e in ents]
    p.produce(TOPIC_OUT, json.dumps(obj).encode("utf-8"))
    p.flush()
    print(f"[ner] -> {TOPIC_OUT} id={obj.get('id')} ents={len(obj['entities'])}")

if __name__ == "__main__":
    c.subscribe([TOPIC_IN])
    try:
        while True:
            msg = c.poll(1.0)
            if msg is None: 
                continue
            if msg.error():
                print(f"[ner] consume error: {msg.error()}", file=sys.stderr)
                continue
            handle(msg.value().decode("utf-8"))
    except KeyboardInterrupt:
        pass
    finally:
        c.close()
