//export const mapNotification = (dto:any)=>dto;

/*
מטרה:
מבטיח שהודעות בזמן אמת ממופות כהלכה עבור הקצה הקדמי.
מטפל בשדות חסרים, נרמול תאריכים וברירות מחדל של סוגים.
ייחודי מכיוון שרק שכבה זו מתרגמת אירועי קצה אחורי/SSE לאובייקטים שמישים.
*/

import { NotificationDTO } from "../models/dto/NotificationDTO";

/**
 * Maps raw notification DTOs to normalized objects (keeps snake_case).
 */
export function mapNotification(dto: NotificationDTO): NotificationDTO {
  return {
    id: dto.id,
    news_id: dto.news_id,
    topic_code: dto.topic_code,
    created_at: dto.created_at,
    title: dto.title,
    message: dto.message,
    read: dto.read ?? false,
  };
}

export function mapNotificationArray(dtos: NotificationDTO[]): NotificationDTO[] {
  return dtos.map(mapNotification);
}
