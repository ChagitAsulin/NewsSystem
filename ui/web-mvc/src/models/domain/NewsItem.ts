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

export type Entity = {
  /**
   * Normalized entity type extracted from the NER service.
   * (person, location, org, misc)
   */
  type: 'person' | 'location' | 'org' | 'misc';

  /** Raw string value (e.g., "Ada Lovelace") */
  value: string;

  /**
   * Optional salience/confidence score (0–1).
   * Useful for future UI enhancements (tooltips, subtle color changes, etc.).
   */
  salience?: number;
};

export type NewsItem = {
  /** Unique ID for UI keying + navigation */
  id: string;

  /** Human-readable title of the news item */
  title: string;

  /** Short summary used in cards and previews */
  summary: string;

  /** Optional image URL (populated via mediaClient) */
  imageUrl?: string;

  /**
   * Topic codes representing the categories this item belongs to.
   * Example: ["science", "technology"]
   */
  topics: string[];

  /**
   * Zero-shot classification result from the AI classifier.
   * (Not always equal to topics — represents semantic category)
   */
  classification: string;

  /** Search/filter tags, user-facing keywords */
  tags: string[];

  /**
   * Named entities extracted via NER.
   * Used for colored badges, filtering, and semantic enrichment.
   */
  entities: Entity[];

  /**
   * Creation timestamp as a Date object.
   * This enables:
   * - Stable time calculations
   * - Beautiful relative-time animations ("3m ago")
   * - Sorting and timeline visualization
   */
  createdAt: Date;
};
