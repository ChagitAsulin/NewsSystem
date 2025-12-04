//export const TopicsRepository={};

import { dbClient } from "../services_access/dbClient";
import { Topic } from "../models/domain/Topic";

/**
 * TopicsRepository
 * Handles all topic CRUD and subscriptions
 */
export const TopicsRepository = {
  async getAll(): Promise<Topic[]> {
    const codes = await dbClient.getTopics();
    return codes.map((code, i) => ({
      id: code, // מזהה ייחודי
      code,
      name: code.charAt(0).toUpperCase() + code.slice(1),
      color: ["#4FC3F7","#2196F3","#00BCD4","#FF9800","#FFAB91","#E91E63","#9C27B0"][i % 7],
      selected: false, // חובה לפי ממשק Topic
    }));
  },

  async subscribe(code: string): Promise<void> {
    await dbClient.subscribeTopic(code);
  },

  async unsubscribe(code: string): Promise<void> {
    await dbClient.unsubscribeTopic(code);
  },
};
