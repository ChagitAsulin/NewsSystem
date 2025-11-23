/*
import { apiGet } from "./apiClient";
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";

export const dbClient = {
  getNewsById: async (id: string) => apiGet<NewsItemDTO>(`/news/${id}`),
  getLatestByTopics: async (topics: string[], limit = 50) =>
    apiGet<NewsItemDTO[]>("/news", { topics: topics.join(","), limit }),
};
*/

/**
 * @file dbClient.ts
 * @description Database-access layer using the unified apiClient.
 * Provides type-safe methods to fetch news items from the backend.
 * Abstracts API calls, allowing the UI to remain clean and declarative.
 */

import { apiGet } from "./apiClient";
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";

export const dbClient = {
  /**
   * Fetch a single news item by its unique ID.
   * @param id - News item ID
   * @returns A NewsItemDTO object
   */
  getNewsById: async (id: string): Promise<NewsItemDTO> =>
    apiGet<NewsItemDTO>(`/news/${id}`),

  /**
   * Fetch the latest news items filtered by topics.
   * @param topics - Array of topic strings
   * @param limit - Maximum number of news items to return (default 50)
   * @returns Array of NewsItemDTO
   */
  getLatestByTopics: async (topics: string[], limit = 50): Promise<NewsItemDTO[]> =>
    apiGet<NewsItemDTO[]>("/news", { topics: topics.join(","), limit }),
};
