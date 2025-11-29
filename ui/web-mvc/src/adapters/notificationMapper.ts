//export const mapNotification = (dto:any)=>dto;

/*
מטרה:
מבטיח שהודעות בזמן אמת ממופות כהלכה עבור הקצה הקדמי.
מטפל בשדות חסרים, נרמול תאריכים וברירות מחדל של סוגים.
ייחודי מכיוון שרק שכבה זו מתרגמת אירועי קצה אחורי/SSE לאובייקטים שמישים.
*/

import { NotificationDTO } from "../models/dto/NotificationDTO";

/// <summary>
/// Maps raw notification data from backend or SSE into NotificationDTO objects
/// for frontend consumption.
/// Ensures strict type compliance with NotificationDTO:
/// - id: unique notification identifier
/// - news_id: associated news item id
/// - created_at: ISO 8601 string representation of creation datetime
/// - topic_code: code of the topic related to this notification
/// </summary>
export function mapNotification(raw: any): NotificationDTO {
  if (!raw) throw new Error("Cannot map undefined or null notification");

  return {
    id: raw.id || raw._id || "",                           // notification unique id
    news_id: raw.news_id || raw.newsId || "",             // associated news item id
    created_at: raw.created_at || raw.createdAt || new Date().toISOString(), // ISO 8601 string
    topic_code: raw.topic_code || raw.topicCode || "",    // topic code (mandatory)
  };
}

/// <summary>
/// Maps an array of raw notifications into NotificationDTO objects.
/// </summary>
/// <param name="rawArray">Array of raw notification objects</param>
/// <returns>Array of NotificationDTO</returns>
export function mapNotificationArray(rawArray: any[]): NotificationDTO[] {
  return rawArray.map(mapNotification);
}

/// <summary>
/// Optional helper function to format created_at into readable date string
/// for display in frontend UI with animations or fancy date formatting.
/// Example usage: formatNotificationDate(notification)
/// </summary>
export function formatNotificationDate(notification: NotificationDTO): string {
  const date = new Date(notification.created_at);
  return date.toLocaleString("he-IL", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
