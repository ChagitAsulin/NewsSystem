# GET /news endpoints placeholder
from fastapi import APIRouter, HTTPException
from typing import List, Dict

router = APIRouter()

# דמו בזיכרון
NEWS: Dict[str, dict] = {
    "n1": {
        "id": "n1",
        "title": "Hello News",
        "summary": "First demo item",
        "topics": ["science"],
        "classification": "science",
        "tags": ["demo"],
        "entities": [{"type": "person", "value": "Ada Lovelace"}],
        "image_public_id": None,
        "created_at": "2025-10-05T00:00:00Z",
    },
    "n2": {
        "id": "n2",
        "title": "Second Item",
        "summary": "Another demo item",
        "topics": ["culture"],
        "classification": "culture",
        "tags": ["demo"],
        "entities": [{"type": "location", "value": "Tel Aviv"}],
        "image_public_id": None,
        "created_at": "2025-10-05T00:01:00Z",
    },
}

@router.get("", response_model=List[dict])
def list_news(topics: str | None = None, limit: int = 50):
    """GET /news?topics=science,culture&limit=50"""
    items = list(NEWS.values())
    if topics:
        wanted = set([t.strip() for t in topics.split(",") if t.strip()])
        items = [x for x in items if any(t in wanted for t in x.get("topics", []))]
    return items[:limit]

@router.get("/{news_id}", response_model=dict)
def get_news(news_id: str):
    item = NEWS.get(news_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item
