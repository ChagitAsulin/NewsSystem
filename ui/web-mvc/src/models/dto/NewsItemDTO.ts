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

/**
 * DTO representing raw news from backend/API.
 * Fields match the API (snake_case) and are mapped by adapters.
 */
export interface NewsItemDTO {
  id: string;
  title: string;
  content: string;
  summary?: string;

  // image file public id (Cloudinary / S3)
  image_public_id?: string;

  topics?: string[];
  classification?: string;
  tags?: string[];

  entities?: EntityDTO[];

  published_at: string;
  created_at: string;

  source?: string;
}

export interface EntityDTO {
  type: string; // person, org, gpe, loc, misc
  name: string; // entity value
  confidence?: number; 
}
