# services/gateway/app/core/cloudinary_utils.py
import os
from typing import Optional, List, Dict, Any

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "dwhnclxja")

# מיפוי נושאים לתמונות ב-Cloudinary (public_id)
TOPIC_IMAGE_MAP: Dict[str, str] = {
    "world": "topics/world",
    "sports": "topics/sports",
    "tech": "topics/tech",
    "business": "topics/business",
    "politics": "topics/politics",
}

# מיפוי ישויות ספציפיות (אם תרצי להשתמש בזה בעתיד)
ENTITY_IMAGE_MAP: Dict[str, str] = {
    "madonna": "entities/madonna",
    "donald trump": "entities/donald_trump",
}


def build_cloudinary_url(public_id: str) -> str:
    url = (
        f"https://res.cloudinary.com/{CLOUDINARY_CLOUD_NAME}"
        f"/image/upload/{public_id}"
    )
    print("DEBUG build_cloudinary_url: public_id=", public_id, "url=", url)
    return url


def normalize_label(lbl: Any) -> str:
    # תומך גם ב-{"label": "Business"} וגם ב-"Business"
    if isinstance(lbl, dict):
        return (lbl.get("label") or "").strip().lower()
    if isinstance(lbl, str):
        return lbl.strip().lower()
    return ""


def normalize_entity_value(ent: Any) -> str:
    if isinstance(ent, dict):
        return (ent.get("value") or "").strip().lower()
    if isinstance(ent, str):
        return ent.strip().lower()
    return ""


def get_image_url(entities: List[Any], labels: List[Any]) -> Optional[str]:
    print("DEBUG get_image_url: raw entities=", entities)
    print("DEBUG get_image_url: raw labels  =", labels)

    # 1) קודם ננסה entities (אם יש מיפוי ישיר)
    for ent in entities or []:
        key = normalize_entity_value(ent)
        if key and key in ENTITY_IMAGE_MAP:
            public_id = ENTITY_IMAGE_MAP[key]
            url = build_cloudinary_url(public_id)
            print("DEBUG get_image_url: matched entity", key, "→", url)
            return url

    # 2) אחר כך ננסה topics מתוך labels
    normalized_topics = [normalize_label(l) for l in (labels or [])]
    print("DEBUG get_image_url: normalized topics =", normalized_topics)

    for topic in normalized_topics:
        if topic in TOPIC_IMAGE_MAP:
            public_id = TOPIC_IMAGE_MAP[topic]
            url = build_cloudinary_url(public_id)
            print("DEBUG get_image_url: matched topic", topic, "→", url)
            return url

    # 3) fallback ל-world תמיד
    if "world" in TOPIC_IMAGE_MAP:
        url = build_cloudinary_url(TOPIC_IMAGE_MAP["world"])
        print("DEBUG get_image_url: fallback to 'world' →", url)
        return url

    print("DEBUG get_image_url: no match, returning None")
    return None
