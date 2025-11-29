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

/**
 * Allowed entity types produced by NER service.
 */
export type EntityType = "person" | "org" | "gpe" | "loc" | "product" | "misc";

/**
 * Entity domain model
 */
export interface Entity {
  /**
   * Value extracted from the text (e.g. "Ada Lovelace")
   */
  value: string;

  /**
   * Type of entity (person, org, gpe, etc).
   * Use lowercase values only.
   */
  type: EntityType;

  /**
   * Optional confidence score from the NER model (0..1).
   * UI can use this to show a subtle badge or tooltip.
   */
  confidence?: number;
}

/**
 * Small helper to normalize raw entity payloads into Entity domain model.
 * Keeps the mapping centralized so UI code can rely on stable types.
 */
export function normalizeEntity(raw: any): Entity {
  return {
    value: raw.value ?? raw.text ?? "",
    type: (raw.type ?? raw.label ?? "misc").toString().toLowerCase() as EntityType,
    confidence: typeof raw.confidence === "number" ? raw.confidence : undefined,
  };
}
