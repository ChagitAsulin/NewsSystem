//export function useTopics(){ return []; }

import { useEffect, useState } from "react";
import { TopicsRepository } from "../repositories/TopicsRepository";

export interface Topic {
  id: string;
  code: string;
  name: string;
  selected: boolean;
  color?: string;
  animate?: boolean; // UI-only animation
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
        const list = await TopicsRepository.getAll();
        const animated = list.map((t, i) => ({
          ...t,
          animate: true,
          color: t.color ?? COLORS[i % COLORS.length],
        }));
        setTopics(animated);

        // Remove animation after it finishes
        setTimeout(() => {
          setTopics((prev) => prev.map((t) => ({ ...t, animate: false })));
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
        t.code === code ? { ...t, selected: !t.selected, animate: true } : t
      )
    );

    setTimeout(() => {
      setTopics((prev) => prev.map((t) => ({ ...t, animate: false })));
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
