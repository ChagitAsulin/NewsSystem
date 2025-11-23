//export const topicsStore={};

/*
תפקיד הקובץ:
topicsStore.ts אחראי על ניהול מצב הנושאים. 
רכיבי UI כמו TopicPicker או הפיד של חדשות יכולים לצרוך את ה־store הזה כדי להציג נושאים שנבחרו, 
לעדכן את ה־UI בזמן אמת, ולשלוח עדכונים ל־Kafka או API.

יתרון מרכזי:

רכיבי UI אחרים לא צריכים לדעת איך לנהל את המצב – הכל נעשה דרך ה־store.

תמיכה באנימציות קלות ניתנת על ידי observables של MobX – כשנושא נבחר או מוסר, 
הרכיב יכול לרנדר עם transition/animation.
*/

/**
 * @file topicsStore.ts
 * @description
 * MobX store for managing news topics in the application.
 * Handles:
 * - Subscribed topics
 * - Selecting/deselecting topics
 * - Reactivity for UI components
 * - Persistence with localStorage (optional)
 *
 * This store allows the UI to reactively update whenever the user selects
 * or deselects topics, ensuring the news feed reflects user preferences immediately.
 */

import { makeAutoObservable, runInAction } from "mobx";

/**
 * Represents a single topic in the system.
 */
export interface Topic {
  id: string;
  name: string;
  selected: boolean;
}

/**
 * TopicsStore
 * 
 * Manages state of available and selected topics.
 * Provides methods for updating selection and integrating with UI components.
 */
export class TopicsStore {
  /** List of all available topics */
  topics: Topic[] = [];

  constructor() {
    makeAutoObservable(this); // Automatically makes all fields observable
  }

  /**
   * Set the list of topics (e.g., fetched from API or config)
   * @param newTopics Array of Topic objects
   */
  setTopics(newTopics: Topic[]) {
    runInAction(() => {
      this.topics = newTopics.map(t => ({ ...t })); // clone to ensure observability
    });
  }

  /**
   * Toggle the selection of a topic
   * @param topicId ID of the topic to toggle
   */
  toggleTopicSelection(topicId: string) {
    runInAction(() => {
      const topic = this.topics.find(t => t.id === topicId);
      if (topic) {
        topic.selected = !topic.selected;
      }
    });
  }

  /**
   * Get all currently selected topics
   * @returns Array of selected Topic objects
   */
  get selectedTopics(): Topic[] {
    return this.topics.filter(t => t.selected);
  }

  /**
   * Check if a topic is selected
   * @param topicId ID of the topic
   * @returns boolean
   */
  isTopicSelected(topicId: string): boolean {
    return !!this.topics.find(t => t.id === topicId && t.selected);
  }

  /**
   * Optional: Persist selected topics to localStorage
   */
  persistSelection() {
    const selectedIds = this.selectedTopics.map(t => t.id);
    localStorage.setItem("selectedTopics", JSON.stringify(selectedIds));
  }

  /**
   * Optional: Load persisted selected topics from localStorage
   */
  loadSelection() {
    const stored = localStorage.getItem("selectedTopics");
    if (stored) {
      const selectedIds: string[] = JSON.parse(stored);
      runInAction(() => {
        this.topics.forEach(t => {
          t.selected = selectedIds.includes(t.id);
        });
      });
    }
  }
}

/**
 * Export a singleton store instance for app-wide usage
 */
export const topicsStore = new TopicsStore();

