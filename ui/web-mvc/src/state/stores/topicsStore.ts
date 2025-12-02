//export const topicsStore={};

/*
תפקיד הקובץ:
topicsStore.ts אחראי על ניהול מצב הנושאים עם אנימציות צבעוניות.
רכיבי UI כמו TopicPicker או הפיד של חדשות יכולים לצרוך את ה־store הזה כדי להציג נושאים שנבחרו,
לעדכן את ה־UI בזמן אמת, ולשלוח עדכונים ל־Kafka או API.
*/

import { makeAutoObservable, runInAction } from "mobx";
import { DateUtils } from '../../utils/dates';

/**
 * Represents a single topic in the system with UI styling info.
 */
export interface Topic {
  id: string;
  name: string;
  selected: boolean;
  color?: string; // צבע מותאם לפרויקט
  lastToggled?: string; // זמן אחרון לשינוי עבור אנימציות
}

/**
 * TopicsStore
 * 
 * Manages state of available and selected topics.
 * Provides methods for updating selection and integrating with UI components with animations.
 */
export class TopicsStore {
  /** List of all available topics */
  topics: Topic[] = [];

  /** Predefined color palette for selected topics */
  private colors = ["#38BDF8", "#1E40AF", "#14B8A6", "#F97316", "#FB7185", "#9333EA", "#FDBA74"];

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Set the list of topics (e.g., fetched from API or config)
   * @param newTopics Array of Topic objects
   */
  setTopics(newTopics: Topic[]) {
    runInAction(() => {
      this.topics = newTopics.map((t, i) => ({
        ...t,
        color: this.colors[i % this.colors.length],
        selected: t.selected || false,
      }));
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
        topic.lastToggled = DateUtils.toISO8601(new Date()); // timestamp for animation
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
          if (t.selected) t.lastToggled = DateUtils.toISO8601(new Date());
        });
      });
    }
  }
}

/**
 * Export a singleton store instance for app-wide usage
 */
export const topicsStore = new TopicsStore();
