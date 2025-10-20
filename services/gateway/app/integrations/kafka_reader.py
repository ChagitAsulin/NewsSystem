import os, time, json
from typing import List, Any
from confluent_kafka import Consumer, TopicPartition

BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "redpanda:9092")

def read_last_messages(topic: str, limit: int = 20, partition: int = 0, timeout_sec: float = 2.0) -> List[Any]:
    """
    קורא את N ההודעות האחרונות מהטופיק (מחיצה 0), בלי לקבע offsets (ephemeral group).
    """
    # group זמני (ללא commit) כדי שלא נשפיע על צרכנים אחרים
    group = f"gateway-reader-{int(time.time()*1000) % 100000}"
    conf = {
        "bootstrap.servers": BOOTSTRAP,
        "group.id": group,
        "enable.auto.commit": False,
        "auto.offset.reset": "latest",
        "session.timeout.ms": 6000,
    }
    c = Consumer(conf)
    try:
        tp = TopicPartition(topic, partition)
        # שולף גבולות (low/high) של המחיצה
        low, high = c.get_watermark_offsets(tp, timeout=timeout_sec)
        if high <= low:
            return []

        start = max(low, high - limit)
        tp.offset = start
        c.assign([tp])

        out: List[Any] = []
        end_offset = high
        deadline = time.time() + timeout_sec

        while True:
            msg = c.poll(0.5)
            if msg is None:
                if time.time() > deadline:
                    break
                continue
            if msg.error():
                continue
            try:
                out.append(json.loads(msg.value().decode("utf-8")))
            except Exception:
                # אם זו לא הודעת JSON — נחזיר מחרוזת גולמית
                out.append(msg.value().decode("utf-8", errors="replace"))

            # עצירה כשהגענו לסוף או לעומק המבוקש
            if msg.offset() + 1 >= end_offset or len(out) >= limit:
                break

        return out
    finally:
        c.close()
