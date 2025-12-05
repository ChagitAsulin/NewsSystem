// ui/web-mvc/src/adapters/newsMapper.ts
import type { NewsItem } from "../models/domain/NewsItem";
import type { NewsItemDTO } from "../models/dto/NewsItemDTO";

/**
 * הפונקציה שאחראית להפוך את השדות הגולמיים משכבת ה-API
 * ל-imageUrl שה-UI משתמש בו.
 */
function resolveImageUrl(dto: NewsItemDTO): string | undefined {
  // קודם כול נשתמש ב-URL המלא שמגיע מה-backend:
  if (dto.image_url && dto.image_url.trim().length > 0) {
    return dto.image_url;
  }

  // אם בעתיד תרצי, אפשר לבנות URL גם מ-image_public_id
  // if (dto.image_public_id) {
  //   return mediaClient.buildUrl(dto.image_public_id);
  // }

  return undefined;
}

/**
 * Map single DTO → domain model.
 */
export function mapNewsItem(dto: NewsItemDTO): NewsItem {
  if (!dto) {
    throw new Error("Cannot map undefined or null NewsItemDTO");
  }

  return {
    id: dto.id,
    title: dto.title,
    summary: dto.summary,
    imageUrl: resolveImageUrl(dto),   // <<< פה זה מתחבר לדומיין
    topics: dto.topics ?? [],
    classification: dto.classification ?? "",
    tags: dto.tags ?? [],
    entities:
      dto.entities?.map((e) => ({
        type: e.type as any,
        value: e.value,
        salience: e.salience,
      })) ?? [],
    createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
  };
}

/**
 * Map array of DTOs → domain models.
 */
export function mapNewsArray(dtos: NewsItemDTO[]): NewsItem[] {
  return dtos.map(mapNewsItem);
}
