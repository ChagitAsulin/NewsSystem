//export const TOPICS=['politics','finance','science','culture','sport'];

/**
 * @file topics.config.ts
 * @description Defines the default topics used throughout the news application.
 * Provides constants for trending topics, max items, and default display.
 */

export const DEFAULT_TOPICS = ["politics", "finance", "science", "culture", "sport"];

/**
 * Maximum number of trending topics to display in UI components.
 */
export const MAX_TRENDING_TOPICS = 10;

/**
 * Minimum number of news items required for a topic to appear in trending lists.
 */
export const MIN_NEWS_ITEMS_FOR_TRENDING = 5;

/**
 * Optional: Mapping topic keys to human-readable labels.
 */
export const TOPIC_LABELS: Record<string, string> = {
  politics: "Politics",
  finance: "Finance",
  science: "Science",
  culture: "Culture",
  sport: "Sport",
};

