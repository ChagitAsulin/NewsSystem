import { dbClient } from "../services_access/dbClient";
import { mapNotificationArray } from "../adapters/notificationMapper";
import { NotificationDTO } from "../models/dto/NotificationDTO";

export const NotificationsRepository = {
  async getAll(): Promise<NotificationDTO[]> {
    const dtos = await dbClient.getNotifications();
    return mapNotificationArray(dtos);
  },

  async getByNewsId(newsId: string): Promise<NotificationDTO[]> {
    const dtos = await dbClient.getNotificationsForNews(newsId);
    return mapNotificationArray(dtos);
  },
};
