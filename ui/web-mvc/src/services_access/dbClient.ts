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
import type { NewsItemDTO } from "../models/dto/NewsItemDTO";
import type { NotificationDTO } from "../models/dto/NotificationDTO";

/**
 * Database Client abstraction for news, topics, and notifications endpoints
 */
export const dbClient = {
  // News
  getNewsById: async (id: string): Promise<NewsItemDTO> =>
    apiGet(`/news/${id}`),

  getLatestByTopics: async (topics: string[], limit = 50): Promise<NewsItemDTO[]> =>
    apiGet("/news", { topics: topics.join(","), limit }),

  // Topics
  getTopics: async (): Promise<string[]> =>
    apiGet("/topics"),

  getTrendingTopics: async (limit = 10): Promise<string[]> =>
    apiGet("/topics/trending", { limit }),

  subscribeTopic: async (code: string): Promise<void> =>
    apiPost(`/topics/${code}/subscribe`),

  unsubscribeTopic: async (code: string): Promise<void> =>
    apiPost(`/topics/${code}/unsubscribe`),

  // Notifications
  getNotifications: async (): Promise<NotificationDTO[]> =>
    apiGet("/notifications"),

  getNotificationsForNews: async (newsId: string): Promise<NotificationDTO[]> =>
    apiGet(`/notifications/news/${newsId}`),
};
