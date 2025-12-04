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

export type EntityType =
  | "person"
  | "loc"
  | "gpe"
  | "org"
  | "product"
  | "misc";

export interface Entity {
  type: EntityType;
  value: string;
  salience?: number;
}
