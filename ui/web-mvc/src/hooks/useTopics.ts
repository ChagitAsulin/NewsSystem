//export function useTopics(){ return []; }

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services_access/apiClient";

export interface Topic {
  code: string;
  name: string;
  selected: boolean;
  /** UI-only animation flag */
  animate?: boolean;
}

/**
 * useTopics Hook
 *
 * Provides a full lifecycle for topic management:
 * - Fetches topics from backend
 * - Manages user selection
 * - Persists topic subscription/unsubscription
 * - Supports UI animations (fade-in on load, highlight on select)
 *
 * This hook is essential for filtering the news feed
 * and enabling personalized real-time notifications.
 */
export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await apiGet<Omit<Topic, "selected">[]>("/topics");

        // Add animation + initial states
        const animated = data.map((t) => ({
          ...t,
          selected: false,
          animate: true, // fade-in animation
        }));

        setTopics(animated);

        // Remove animation flag after animation ends
        setTimeout(() => {
          setTopics((prev) =>
            prev.map((t) => ({
              ...t,
              animate: false,
            }))
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

  /**
   * Toggles a topic selection and updates backend subscription.
   */
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

    try {
      const topic = topics.find((t) => t.code === code);
      if (!topic) return;

      if (!topic.selected) {
        await apiPost("/topics/subscribe", { code });
      } else {
        await apiPost("/topics/unsubscribe", { code });
      }
    } catch (err) {
      console.error("Subscription update failed:", err);
    }
  };

  return { topics, toggleTopic, loading, error };
}
