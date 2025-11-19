/*גרסה קודמת=========================================================

export type NewsItemDTO = {
  id: string;
  title: string;
  summary: string;
  image_public_id?: string;
  topics?: string[];
  classification?: string;
  tags?: string[];
  entities?: Array<{ type: 'person' | 'location' | 'org' | 'misc'; value: string; salience?: number }>;
  created_at?: string; // ISO
};

=========================================================*/

/**
 * DTO (Data Transfer Object) representing the raw payload received from the backend.
 * This is *not* used directly by the UI. Instead, adapters transform it into the
 * normalized `NewsItem` domain model.
 *
 * DTOs intentionally allow optional/loose fields because:
 * - Different services may return different shapes.
 * - Gateways and queues may omit fields in certain flows.
 */

export type NewsItemDTO = {
  /** Backend-provided ID (string from DB or pipeline) */
  id: string;

  /** Headline/title as sent by the backend */
  title: string;

  /** Raw summary/description field */
  summary: string;

  /**
   * Optional public ID for image storage services (e.g., Cloudinary).
   * The UI never uses this directly — mediaClient resolves it into imageUrl.
   */
  image_public_id?: string;

  /** Topic codes (optional because pipeline may omit them in partial pushes) */
  topics?: string[];

  /** Zero-shot classification label */
  classification?: string;

  /** UI or backend-generated filtering tags */
  tags?: string[];

  /**
   * Raw NER entities as returned by the model.
   * Adapters are responsible for normalizing them into the Entity domain format.
   */
  entities?: Array<{
    type: 'person' | 'location' | 'org' | 'misc';
    value: string;
    salience?: number;
  }>;

  /**
   * Raw timestamp as ISO string.
   * adapters → convert to Date (domain: `createdAt: Date`)
   */
  created_at?: string;
};
