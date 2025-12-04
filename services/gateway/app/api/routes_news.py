import logging
from fastapi import APIRouter, Query, HTTPException
from typing import Any, List

from app.integrations.news_db import list_news_from_db, get_news_by_id

logger = logging.getLogger("gateway.news")
router = APIRouter(prefix="/news", tags=["news"])

@router.get("", response_model=List[Any])
def list_news(limit: int = Query(20, ge=1, le=200)):
    items = list_news_from_db(limit=limit)
    logger.debug("returned %d news items from DB", len(items))
    return items

@router.get("/{news_id}", response_model=Any)
def get_news(news_id: str):
    item = get_news_by_id(news_id)
    if not item:
        raise HTTPException(status_code=404, detail="News not found")
    return item
