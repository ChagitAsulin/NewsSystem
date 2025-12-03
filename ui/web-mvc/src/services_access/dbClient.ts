/*
import { apiGet } from "./apiClient";
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";

export const dbClient = {
  getNewsById: async (id: string) => apiGet<NewsItemDTO>(`/news/${id}`),
  getLatestByTopics: async (topics: string[], limit = 50) =>
    apiGet<NewsItemDTO[]>("/news", { topics: topics.join(","), limit }),
};
*/

import { apiGet, apiPost } from "./apiClient";
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";

/**
 * Database Client abstraction for news and topics endpoints
 */
export const dbClient = {
  /** Fetch a single news item by ID */
  getNewsById: async (id: string): Promise<NewsItemDTO> => {
    console.info(`dbClient.getNewsById: ${id}`);
    return apiGet<NewsItemDTO>(`/news/${id}`);
  },

  /** Fetch latest news filtered by topics */
  getLatestByTopics: async (topics: string[], limit = 50): Promise<NewsItemDTO[]> => {
    console.info(`dbClient.getLatestByTopics: ${topics.join(", ")} limit=${limit}`);
    return apiGet<NewsItemDTO[]>("/news", { topics: topics.join(","), limit });
  },

  /** Get all topics */
  getTopics: async (): Promise<string[]> => {
    console.info("dbClient.getTopics called");
    return apiGet<string[]>("/topics");
  },

  /** Get trending topics */
  getTrendingTopics: async (limit = 10): Promise<string[]> => {
    console.info(`dbClient.getTrendingTopics: limit=${limit}`);
    return apiGet<string[]>("/topics/trending", { limit });
  },

  /** Subscribe to a topic */
  subscribeTopic: async (code: string): Promise<void> => {
    console.info(`dbClient.subscribeTopic: ${code}`);
    await apiPost("/topics/subscribe", { code });
  },

  /** Unsubscribe from a topic */
  unsubscribeTopic: async (code: string): Promise<void> => {
    console.info(`dbClient.unsubscribeTopic: ${code}`);
    await apiPost("/topics/unsubscribe", { code });
  },
};
