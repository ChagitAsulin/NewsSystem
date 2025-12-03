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

// models/dto/NewsItemDTO.ts
import type { Entity } from "../domain/Entity";

export interface NewsItemDTO {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  source: string;
  url?: string;

  entities: Entity[];
  topics: string[];
}
