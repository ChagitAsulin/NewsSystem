/*
import { apiGet } from "./apiClient";
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";

export const dbClient = {
  getNewsById: async (id: string) => apiGet<NewsItemDTO>(`/news/${id}`),
  getLatestByTopics: async (topics: string[], limit = 50) =>
    apiGet<NewsItemDTO[]>("/news", { topics: topics.join(","), limit }),
};
*/

// src/services_access/dbClient.ts

import { apiGet } from "./apiClient";
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";

/**
 * Database Client abstraction.
 * Provides type-safe, centralized access to backend endpoints.
 * All calls return typed data and handle query parameters consistently.
 */
export const dbClient = {
  /**
   * Fetch a single news item by its unique ID.
   * @param id - Unique identifier of the news item
   * @returns Promise resolving to NewsItemDTO
   */
  getNewsById: async (id: string): Promise<NewsItemDTO> =>
    apiGet<NewsItemDTO>(`/news/${id}`),

  /**
   * Fetch the latest news items filtered by topics.
   * @param topics - Array of topic strings to filter
   * @param limit - Maximum number of news items to return (default 50)
   * @returns Promise resolving to an array of NewsItemDTO
   */
  getLatestByTopics: async (
    topics: string[],
    limit = 50
  ): Promise<NewsItemDTO[]> =>
    apiGet<NewsItemDTO[]>("/news", { topics: topics.join(","), limit }),

  /**
   * Retrieve all available topics in the system.
   * Useful for dropdowns, filters, or topic lists.
   * @returns Promise resolving to an array of topic strings
   */
  getTopics: async (): Promise<string[]> =>
    apiGet<string[]>("/topics"),

  /**
   * Fetch trending topics.
   * @param limit - Number of top trending topics to fetch (default 10)
   * @returns Promise resolving to an array of trending topic strings
   */
  getTrendingTopics: async (limit = 10): Promise<string[]> =>
    apiGet<string[]>("/topics/trending", { limit }),
};
