/*================================================================גרסה קודמת

export type Entity = {
  type: 'person' | 'location' | 'org' | 'misc';
  value: string;
  salience?: number;
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;          // נבנה מ-mediaClient (לא חובה עכשיו)
  topics: string[];           // לדוגמה ["science"]
  classification: string;     // תוצאת zero-shot
  tags: string[];             // תגיות כלליות
  entities: Entity[];         // ישויות מ-NER
  createdAt: Date;            // תאריך יצירה כ-Date
};

================================================================*/

/**
 * Domain model representing the normalized News Item used across the entire UI.
 *
 * This type is intentionally strict:
 * - Ensures consistent structure for all components (NewsCard, NewsDetails, etc.).
 * - Allows animation engines (Framer Motion) to rely on stable keys (id).
 * - Forces `createdAt` to be a Date object for proper formatting and transitions.
 *
 * The model is purposely kept lightweight — heavier transformations occur in adapters.
 */

// models/domain/NewsItem.ts
import type { Entity } from "./Entity";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  source: string;
  url?: string;

  entities: Entity[];
  topics: string[];
}
