# fetch from News API and publish to Kafka (raw_news)
import os
import time
import json
import hashlib
import logging
from typing import List, Dict, Optional

import requests

log = logging.getLogger("fetcher")
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
)

NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "").strip()
NEWS_COUNTRY = os.getenv("NEWS_COUNTRY", "us")
NEWS_LANGUAGE = os.getenv("NEWS_LANGUAGE", "en")
NEWS_TOPICS = [t.strip() for t in os.getenv("NEWS_TOPICS", "Politics,Sports,Tech,World,Business").split(",") if t.strip()]
FETCH_MODE = os.getenv("FETCH_MODE", "auto").lower()  # 'auto' | 'api' | 'mock'
FETCH_PAGE_SIZE = int(os.getenv("FETCH_PAGE_SIZE", "10"))

def _mk_id(url: str, published_at: Optional[str]) -> str:
    base = f"{url}|{published_at or ''}"
    return hashlib.sha1(base.encode("utf-8")).hexdigest()[:16]

def _normalize(article: Dict, topics_hint: List[str]) -> Dict:
    url = article.get("url") or ""
    published_at = article.get("publishedAt") or article.get("published_at")
    return {
        "id": article.get("id") or _mk_id(url, published_at),
        "title": article.get("title"),
        "source": (article.get("source") or {}).get("name") if isinstance(article.get("source"), dict) else article.get("source"),
        "url": url,
        "content": article.get("content") or article.get("description"),
        "published_at": published_at,
        "lang": NEWS_LANGUAGE,
        "topics_hint": topics_hint,
    }

def fetch_mock() -> List[Dict]:
    log.info("mock mode: generating sample articles")
    return [
        {
            "id": "mock-hello-1",
            "title": "Mock: Barack Obama met in Paris",
            "source": "mock",
            "url": "https://example.com/obama-paris",
            "content": "Meeting with leaders",
            "published_at": "2025-10-19T00:00:00Z",
            "lang": "en",
            "topics_hint": ["Politics","World"]
        }
    ]

def fetch_newsapi_for_topic(topic: str) -> List[Dict]:
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "apiKey": NEWSAPI_KEY,
        "q": topic,
        "pageSize": FETCH_PAGE_SIZE,
        "language": NEWS_LANGUAGE,
        # אם את מעדיפה לפי מדינה:
        # "country": NEWS_COUNTRY,
    }
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()
    articles = data.get("articles") or []
    return [_normalize(a, topics_hint=[topic]) for a in articles]

def fetch_once() -> List[Dict]:
    """
    בוחר מקור לפי מצב:
    - FETCH_MODE=mock ⇒ החזרה מדומה
    - FETCH_MODE=api ⇒ תמיד NewsAPI
    - FETCH_MODE=auto ⇒ NewsAPI אם יש NEWSAPI_KEY, אחרת mock
    """
    mode = FETCH_MODE
    if mode == "auto":
        mode = "api" if NEWSAPI_KEY else "mock"

    if mode == "mock":
        return fetch_mock()

    # mode == "api"
    all_items: List[Dict] = []
    for t in NEWS_TOPICS:
        try:
            items = fetch_newsapi_for_topic(t)
            all_items.extend(items)
            time.sleep(0.2)  # נחמד ל-API
        except requests.HTTPError as e:
            log.warning("newsapi topic %s failed: %s", t, e)
        except requests.RequestException as e:
            log.warning("newsapi network error: %s", e)
    # סינון כפילויות לפי id
    uniq: Dict[str, Dict] = {}
    for it in all_items:
        uniq[it["id"]] = it
    items = list(uniq.values())
    log.info("fetched %d items (mode=%s)", len(items), mode)
    return items
