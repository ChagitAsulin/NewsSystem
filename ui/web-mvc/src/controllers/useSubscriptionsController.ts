//export function useSubscriptionsController(){ return {}; }

import { useCallback } from "react";
import { apiGet, apiPost } from "../services_access/apiClient";
import { Topic } from "../models/domain/Topic";

/**
 * useSubscriptionsController
 * Handles topic subscriptions and fetching available topics.
 */
export function useSubscriptionsController() {
  /**
   * Fetch all available topics from the server.
   * @returns Promise of Topic[]
   */
  const fetchTopics = useCallback(async (): Promise<Topic[]> => {
    try {
      const topics = await apiGet<Topic[]>("/topics");
      return topics;
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      return [];
    }
  }, []);

  /**
   * Subscribe the current user to a topic.
   * @param topicId The topic identifier
   * @returns boolean indicating success
   */
  const subscribeToTopic = useCallback(
    async (topicId: string): Promise<boolean> => {
      try {
        await apiPost(`/topics/${topicId}/subscribe`);
        return true;
      } catch (error) {
        console.error(`Failed to subscribe to topic ${topicId}:`, error);
        return false;
      }
    },
    []
  );

  /**
   * Unsubscribe the current user from a topic.
   * @param topicId The topic identifier
   * @returns boolean indicating success
   */
  const unsubscribeFromTopic = useCallback(
    async (topicId: string): Promise<boolean> => {
      try {
        await apiPost(`/topics/${topicId}/unsubscribe`);
        return true;
      } catch (error) {
        console.error(`Failed to unsubscribe from topic ${topicId}:`, error);
        return false;
      }
    },
    []
  );

  return {
    fetchTopics,
    subscribeToTopic,
    unsubscribeFromTopic,
  };
}
