//export type Entity = { type:'person'|'location'|'org'|'misc'; value:string; salience?:number };

/**
 * src/models/domain/Entity.ts
 *
 * Domain model representing a named entity extracted from a news item.
 * This is used across UI components (EntityTags, NewsDetails) and by adapters.
 *
 * The model intentionally keeps `type` normalized (lowercase) to simplify
 * CSS mapping and color theming in the UI.
 */

// models/domain/Entity.ts
export type EntityType =
  | "person"
  | "org"
  | "gpe"       // Geo Political Entity
  | "loc"
  | "product"
  | "misc";

export interface Entity {
  value: string;
  type: EntityType;
  confidence?: number; // כמו salience, אך אוניברסלי יותר
}
