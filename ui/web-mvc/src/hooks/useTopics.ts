//export function useTopics(){ return []; }

import { useEffect, useState } from "react";
import { TopicsRepository } from "../repositories/TopicsRepository";

export interface Topic {
  code: string;
  name: string;
  selected: boolean;
  color?: string;
  /** UI-only animation flag */
  animate?: boolean;
}

/** צבעי הפרויקט */
const COLORS = ["#00bfff", "#1e90ff", "#40e0d0", "#ffa500", "#ffb6c1", "#9370db", "#ffdab9"];

/**
 * useTopics Hook
 * ----------------
 * Handles full lifecycle of topic management:
 * fetch, select/unselect, backend sync, UI animations, colors.
 */
export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /** Fetch topics from backend and assign colors */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const codes = await TopicsRepository.getAll();
        const animated = codes.map((code, i) => ({
          code,
          name: code.charAt(0).toUpperCase() + code.slice(1), // human-readable
          selected: false,
          animate: true,
          color: COLORS[i % COLORS.length],
        }));
        setTopics(animated);

        // Remove animation after it finishes
        setTimeout(() => {
          setTopics((prev) =>
            prev.map((t) => ({ ...t, animate: false }))
          );
        }, 600);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  /** Toggle topic selection and sync with backend */
  const toggleTopic = async (code: string) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.code === code
          ? { ...t, selected: !t.selected, animate: true }
          : t
      )
    );

    setTimeout(() => {
      setTopics((prev) =>
        prev.map((t) => ({ ...t, animate: false }))
      );
    }, 400);

    const topic = topics.find((t) => t.code === code);
    if (!topic) return;

    try {
      if (!topic.selected) {
        await TopicsRepository.subscribe(code);
      } else {
        await TopicsRepository.unsubscribe(code);
      }
    } catch (err) {
      console.error("Subscription update failed:", err);
    }
  };

  return { topics, toggleTopic, loading, error };
}
