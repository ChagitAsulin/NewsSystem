//export const TopicsRepository={};

import { dbClient } from "@/services_access/dbClient";

/**
 * TopicsRepository
 * ----------------------
 * This repository manages all topic-related data.
 * Provides methods to fetch and query topics, encapsulating 
 * the underlying data source logic and ensuring type safety.
 */
export const TopicsRepository = {
  /**
   * Fetch all available topics.
   * @returns Promise resolving to an array of topic strings
   */
  async getAll(): Promise<string[]> {
    // For now, we fetch the topics from the API or database
    const topics = await dbClient.getTopics(); // Make sure dbClient has getTopics()
    return topics;
  },

  /**
   * Fetch trending topics based on recent activity.
   * @param limit - Maximum number of trending topics
   * @returns Promise resolving to an array of topic strings
   */
  async getTrending(limit = 10): Promise<string[]> {
    const topics = await dbClient.getTrendingTopics(limit); // Make sure dbClient has getTrendingTopics()
    return topics;
  },
};
