//export type Topic = { code:string; name:string; subscribed:boolean };

/**
 * src/models/domain/Topic.ts
 *
 * Domain model for a selectable Topic in the UI.
 * Topics are the main filter unit for the news feed (Politics, Finance, etc).
 */

// models/domain/Topic.ts
export interface Topic {
  id: string;
  name: string;
  description?: string;
}
