import os
import sys
from typing import List, Any, Optional

import firebase_admin
from firebase_admin import credentials, firestore

CRED_PATH   = os.getenv("FIREBASE_CREDENTIALS", "/app/firebase-key.json")
PROJECT_ID  = os.getenv("FIREBASE_PROJECT_ID")
COLLECTION  = os.getenv("FIREBASE_COLLECTION", "news")

_db = None
_collection = None

# אתחול Firebase פעם אחת, אבל לא מפילים את האפליקציה אם יש כשל
try:
    cred = credentials.Certificate(CRED_PATH)
    firebase_admin.initialize_app(cred, {"projectId": PROJECT_ID})
    _db = firestore.client()
    _collection = _db.collection(COLLECTION)
    print(f"[news_db] Firebase initialized. project={PROJECT_ID}, collection={COLLECTION}")
except Exception as e:
    print(f"[news_db] Firebase init FAILED: {e}", file=sys.stderr)
    _db = None
    _collection = None


def list_news_from_db(limit: int = 20) -> List[Any]:
    """
    מחזיר רשימת חדשות מה-DB, מהחדשה לישנה.
    אם Firebase לא מאותחל – מחזיר רשימה ריקה.
    """
    if _collection is None:
        # אין חיבור ל-DB – לא מפילים את השרת, רק מחזירים ריק
        return []

    docs = (
        _collection
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )

    out: List[Any] = []
    for d in docs:
        item = d.to_dict()
        item.setdefault("id", d.id)
        out.append(item)
    return out


def get_news_by_id(news_id: str) -> Optional[Any]:
    """
    מחזיר ידיעה בודדת לפי ID, או None אם לא קיימת / אין חיבור ל-DB.
    """
    if _collection is None:
        return None

    doc_ref = _collection.document(news_id)
    doc = doc_ref.get()
    if not doc.exists:
        return None
    item = doc.to_dict()
    item.setdefault("id", doc.id)
    return item
