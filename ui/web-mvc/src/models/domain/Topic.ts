//export type Topic = { code:string; name:string; subscribed:boolean };

/**
 * src/models/domain/Topic.ts
 *
 * Domain model for a selectable Topic in the UI.
 * Topics are the main filter unit for the news feed (Politics, Finance, etc).
 */

/**
 * Topic domain model
 */
export interface Topic {
  /**
   * Unique machine-friendly code for the topic (e.g. 'politics', 'finance').
   * Used when subscribing/unsubscribing in the gateway.
   */
  code: string;

  /**
   * Human friendly title (e.g. 'Politics')
   */
  name: string;

  /**
   * Optional UI color token (e.g. 'blue-500' or '#1f77b4').
   * UI components should fallback to a sensible palette if missing.
   */
  color?: string;
}
