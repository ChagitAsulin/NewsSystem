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

import { dbClient } from "@/services_access/dbClient";
import { mapNewsItem } from "@/adapters/newsMapper";
import type { NewsItem } from "@/models/domain/NewsItem";

/**
 * NewsRepository
 * ----------------------
 * This repository centralizes all data operations related to news items.
 * It fetches data from the dbClient, maps DTOs to domain models,
 * and abstracts away low-level API or database details.
 * 
 * Responsibilities:
 * - Encapsulates all News-specific data access logic.
 * - Ensures consistent mapping from DTOs to domain objects.
 * - Provides type-safe methods for getting single or multiple news items.
 */
export const NewsRepository = {
  /**
   * Fetch a single news item by its ID.
   * @param id - Unique identifier of the news item
   * @returns Promise resolving to a mapped NewsItem
   */
  async getById(id: string): Promise<NewsItem> {
    const dto = await dbClient.getNewsById(id);
    return mapNewsItem(dto);
  },

  /**
   * Fetch latest news items for specific topics.
   * @param topics - Array of topic strings
   * @param limit - Maximum number of items to return (default 50)
   * @returns Promise resolving to an array of mapped NewsItem objects
   */
  async getLatest(topics: string[], limit = 50): Promise<NewsItem[]> {
    const list = await dbClient.getLatestByTopics(topics, limit);
    return list.map(mapNewsItem);
  },
};
