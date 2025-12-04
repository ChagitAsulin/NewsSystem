//export type NotificationDTO = { id:string; news_id:string; topic_code:string; created_at:string };

/**
 * src/models/dto/NotificationDTO.ts
 *
 * DTO used by the notification stream (SSE) and notification endpoints.
 * Keep snake_case here if the backend uses that convention.
 *
 * Fields:
 * - id: notification id
 * - news_id: id of related NewsItem
 * - created_at: ISO 8601 string
 * - topic_code: topic the notification refers to
 */

/**
 * DTO used by notification endpoints or SSE stream.
 */
export interface NotificationDTO {
  id: string;
  news_id: string;
  topic_code: string;
  created_at: string;
  title?: string;
  message?: string;
  read?: boolean;
}
