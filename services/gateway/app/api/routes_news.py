# services/gateway/app/api/routes_news.py
import logging
from fastapi import APIRouter, Query, HTTPException
from typing import Any, List

from fastapi.encoders import jsonable_encoder

from app.integrations.news_db import list_news_from_db, get_news_by_id
from app.core.cloudinary_utils import get_image_url

logger = logging.getLogger("gateway.news")
router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=List[Any])
def list_news(limit: int = Query(20, ge=1, le=200)):
    logger.info("list_news called with limit=%d", limit)

    # הרשומות הגולמיות מ-Firebase
    raw_items = list_news_from_db(limit=limit)

    # המרה ל-dict-ים כדי שנוכל להוסיף שדות
    items = jsonable_encoder(raw_items)

    logger.info("list_news: got %d items from DB", len(items))

    for idx, item in enumerate(items):
        entities = item.get("entities") or []
        labels = item.get("labels") or []

        print("DEBUG list_news item", idx, "labels=", labels)

        image_url = get_image_url(entities, labels)

        print("DEBUG list_news item", idx, "computed image_url=", image_url)

        item["image_url"] = image_url

    return items


@router.get("/{news_id}", response_model=Any)
def get_news(news_id: str):
    logger.info("get_news called with id=%s", news_id)

    raw_item = get_news_by_id(news_id)
    if not raw_item:
        raise HTTPException(status_code=404, detail="News not found")

    item = jsonable_encoder(raw_item)

    entities = item.get("entities") or []
    labels = item.get("labels") or []

    print("DEBUG get_news labels=", labels)

    item["image_url"] = get_image_url(entities, labels)

    return item
