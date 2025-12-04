/*
import { dbClient } from "@/services_access/dbClient";
import { mapNewsItem } from "@/adapters/newsMapper";

export const NewsRepository = {
  async getById(id: string) {
    const dto = await dbClient.getNewsById(id);
    return mapNewsItem(dto);
  },
  async getLatest(topics: string[], limit = 50) {
    const list = await dbClient.getLatestByTopics(topics, limit);
    return list.map(mapNewsItem);
  },
};
*/

import { dbClient } from "../services_access/dbClient";
import { NewsItem } from "../models/domain/NewsItem";
import { Entity } from "../models/domain/Entity"; 
import { NewsItemDTO } from "../models/dto/NewsItemDTO";

export const NewsRepository = {
  async getAll(): Promise<NewsItem[]> {
    const dtos = await dbClient.getLatestByTopics([]);
    return dtos.map((dto) => {
      const entities: Entity[] = (dto.entities ?? []).map((e: any) => ({
        value: e.value || e.name || "",
        type: e.type || "misc",
        confidence: e.salience ?? e.confidence,
      }));

      return {
        id: dto.id,
        title: dto.title,
        content: dto.content,
        summary: dto.summary,
        imageUrl: dto.image_public_id ? `/media/${dto.image_public_id}` : undefined,
        topics: dto.topics ?? [],
        classification: dto.classification ?? "",
        tags: dto.tags ?? [],
        entities,
        createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
        publishedAt: dto.published_at ? new Date(dto.published_at) : new Date(),
        source: dto.source ?? "",
      };
    });
  },

  async getById(id: string): Promise<NewsItem | null> {
    try {
      const dto = await dbClient.getNewsById(id);
      const entities: Entity[] = (dto.entities ?? []).map((e: any) => ({
        value: e.value || e.name || "",
        type: e.type || "misc",
        confidence: e.salience ?? e.confidence,
      }));

      return {
        id: dto.id,
        title: dto.title,
        content: dto.content,
        summary: dto.summary,
        imageUrl: dto.image_public_id ? `/media/${dto.image_public_id}` : undefined,
        topics: dto.topics ?? [],
        classification: dto.classification ?? "",
        tags: dto.tags ?? [],
        entities,
        createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
        publishedAt: dto.published_at ? new Date(dto.published_at) : new Date(),
        source: dto.source ?? "",
      };
    } catch {
      return null;
    }
  },

  /** ✅ גרסת getLatest מקצועית לתמיכה ב־UI */
  async getLatest(topics: string[], limit = 50): Promise<NewsItem[]> {
    const dtos = await dbClient.getLatestByTopics(topics, limit);
    return dtos.map((dto) => {
      const entities: Entity[] = (dto.entities ?? []).map((e: any) => ({
        value: e.value || e.name || "",
        type: e.type || "misc",
        confidence: e.salience ?? e.confidence,
      }));

      return {
        id: dto.id,
        title: dto.title,
        content: dto.content,
        summary: dto.summary,
        imageUrl: dto.image_public_id ? `/media/${dto.image_public_id}` : undefined,
        topics: dto.topics ?? [],
        classification: dto.classification ?? "",
        tags: dto.tags ?? [],
        entities,
        createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
        publishedAt: dto.published_at ? new Date(dto.published_at) : new Date(),
        source: dto.source ?? "",
      };
    }).slice(0, limit);
  },
};
