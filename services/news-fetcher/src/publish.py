# kafka publish helper
import os
import json
import time
import logging
from typing import List, Dict

from confluent_kafka import Producer

from .fetch import fetch_once

BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "redpanda:9092")
TOPIC_OUT = os.getenv("TOPIC_OUT", "raw_news")
INTERVAL_SEC = int(os.getenv("FETCH_INTERVAL_SEC", "15"))

log = logging.getLogger("publisher")
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
)

def _delivery(err, msg):
    if err is not None:
        log.error("delivery failed: %s", err)
    else:
        log.debug("delivered to %s [%d] @%d", msg.topic(), msg.partition(), msg.offset())

def publish_batch(p: Producer, batch: List[Dict]):
    if not batch:
        log.info("no items to publish")
        return
    for item in batch:
        p.produce(TOPIC_OUT, json.dumps(item).encode("utf-8"), callback=_delivery)
    p.flush()
    log.info("published %d messages to %s", len(batch), TOPIC_OUT)

if __name__ == "__main__":
    p = Producer({"bootstrap.servers": BOOTSTRAP})
    log.info("bootstrap=%s topic_out=%s interval=%ss", BOOTSTRAP, TOPIC_OUT, INTERVAL_SEC)
    try:
        while True:
            try:
                items = fetch_once()
                publish_batch(p, items)
            except Exception as e:
                log.exception("fetch/publish iteration failed: %s", e)
            time.sleep(INTERVAL_SEC)
    except KeyboardInterrupt:
        log.info("stopping publisher...")
