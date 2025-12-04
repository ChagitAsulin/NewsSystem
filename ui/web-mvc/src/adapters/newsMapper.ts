/*
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";
import type { NewsItem } from "@/models/domain/NewsItem";

export const mapNewsItem = (dto: NewsItemDTO): NewsItem => ({
  id: dto.id,
  title: dto.title,
  summary: dto.summary,
  imageUrl: undefined, // אפשר לחבר ל-mediaClient כשיהיה image_public_id
  topics: (dto as any).topics ?? [],
  classification: (dto as any).classification ?? "",
  tags: (dto as any).tags ?? [],
  entities: (dto as any).entities ?? [],
  createdAt: new Date((dto as any).created_at ?? Date.now()),
});

*/

/*
מטרה:
המרת תגובות גולמיות של API/DB לאובייקטי NewsItem.
מבטיחה שממשק המשתמש מקבל תמיד מבנה נקי ועקבי.
ייחודי משום שרק שכבת ההתאמה יודעת כיצד לנרמל נתוני backend גולמיים.
*/

import { NewsItem } from "../models/domain/NewsItem";
import { Entity } from "../models/domain/Entity"; // ✅ תוקן
import { NewsItemDTO } from "../models/dto/NewsItemDTO";

export function mapNewsItem(raw: any): NewsItem {
  if (!raw) throw new Error("Cannot map undefined or null news item");

  const entities: Entity[] = (raw.entities ?? []).map((e: any) => ({
    value: e.value || e.name || "",
    type: e.type || "misc",
    confidence: e.salience ?? e.confidence,
  }));

  return {
    id: raw.id || raw._id || "",
    title: raw.title || "",
    content: raw.content || "",
    summary: raw.summary || "",
    imageUrl: raw.imageUrl || raw.image_url || (raw.image_public_id ? `/media/${raw.image_public_id}` : undefined),
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : new Date(),
    topics: raw.topics || [],
    classification: raw.classification || "",
    tags: raw.tags || [],
    entities,
    source: raw.source || "",
  };
}

export function mapNewsArray(rawArray: any[]): NewsItem[] {
  return rawArray.map(mapNewsItem);
}
