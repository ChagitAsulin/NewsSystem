//export class NotificationsController {}

import { apiGet } from "../services_access/apiClient";
import { NotificationDTO } from "../models/dto/NotificationDTO";

/**
 * NotificationsController
 * Provides functions to retrieve notifications.
 */
export class NotificationsController {
  /**
   * Fetch all notifications from the server.
   * @returns Promise of NotificationDTO[]
   */
  async fetchAllNotifications(): Promise<NotificationDTO[]> {
    try {
      const notifications = await apiGet<NotificationDTO[]>("/notifications");
      return notifications;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  }

  /**
   * Fetch notifications related to a specific news item.
   * @param newsId Identifier of the news item
   * @returns Promise of NotificationDTO[]
   */
  async fetchNotificationsForNews(newsId: string): Promise<NotificationDTO[]> {
    try {
      const notifications = await apiGet<NotificationDTO[]>(
        `/notifications/news/${newsId}`
      );
      return notifications;
    } catch (error) {
      console.error(
        `Failed to fetch notifications for news item ${newsId}:`,
        error
      );
      return [];
    }
  }
}
