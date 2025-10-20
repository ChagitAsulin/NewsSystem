import logging
from fastapi import APIRouter, Query
from typing import Any, List
from app.integrations.kafka_reader import read_last_messages

logger = logging.getLogger("gateway.notifications")
router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=List[Any])
def list_notifications(limit: int = Query(20, ge=1, le=200)):
    items = read_last_messages(topic="notifications", limit=limit)
    items = items[::-1]
    logger.debug("returned %d notifications", len(items))
    return items
