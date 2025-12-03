//export const TopicsRepository={};

import { dbClient } from "@/services_access/dbClient";

/**
 * TopicsRepository
 * ----------------------
 * Manages all topic-related data access.
 * Encapsulates fetching, subscribing, unsubscribing, and trending logic.
 */
export const TopicsRepository = {
  /** Fetch all topics */
  async getAll(): Promise<string[]> {
    return dbClient.getTopics();
  },

  /** Fetch trending topics */
  async getTrending(limit = 10): Promise<string[]> {
    return dbClient.getTrendingTopics(limit);
  },

  /** Subscribe to a topic */
  async subscribe(code: string): Promise<void> {
    return dbClient.subscribeTopic(code);
  },

  /** Unsubscribe from a topic */
  async unsubscribe(code: string): Promise<void> {
    return dbClient.unsubscribeTopic(code);
  },
};
