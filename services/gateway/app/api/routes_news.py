import logging
from fastapi import APIRouter, Query
from typing import Any, List
from app.integrations.kafka_reader import read_last_messages

logger = logging.getLogger("gateway.news")
router = APIRouter(prefix="/news", tags=["news"])

@router.get("", response_model=List[Any])
def list_news(limit: int = Query(20, ge=1, le=200)):
    items = read_last_messages(topic="enriched_news", limit=limit)
    # אם רוצים חדש->ישן:
    items = items[::-1]
    logger.debug("returned %d news items", len(items))
    return items
