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
import { NewsItemDTO } from "../models/dto/NewsItemDTO";

/// <summary>
/// Maps raw news data from API or backend into NewsItem objects
/// ready for frontend consumption. Ensures strict type compliance:
/// - id: unique identifier of the news
/// - title: news title
/// - summary: brief summary
/// - imageUrl: optional image URL
/// - createdAt: Date object (used in frontend formatting)
/// - topics: array of topic codes
/// - classification: optional classification label
/// - tags: optional tags for search/filtering
/// - entities: extracted entities (person, org, location, misc)
/// </summary>
export function mapNewsItem(raw: any): NewsItem {
  if (!raw) throw new Error("Cannot map undefined or null news item");

  return {
    id: raw.id || raw._id || "",
    title: raw.title || "",
    summary: raw.summary || "",
    imageUrl: raw.imageUrl || raw.image_url || "",
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    topics: raw.topics || [],
    classification: raw.classification || "",
    tags: raw.tags || [],
    entities: raw.entities || [],
  };
}

/// <summary>
/// Maps an array of raw news items into NewsItem objects
/// </summary>
/// <param name="rawArray">Array of raw news items</param>
/// <returns>Array of NewsItem</returns>
export function mapNewsArray(rawArray: any[]): NewsItem[] {
  return rawArray.map(mapNewsItem);
}

/// <summary>
/// Optional helper function to format createdAt to readable string for frontend UI
/// with elegant date representation suitable for animations and hover effects.
/// Example usage: formatNewsDate(newsItem)
/// </summary>
export function formatNewsDate(newsItem: NewsItem): string {
  return newsItem.createdAt.toLocaleString("he-IL", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
