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
