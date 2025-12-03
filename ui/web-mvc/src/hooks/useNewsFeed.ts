//export function useNewsFeed(){ return []; }

import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "../models/domain/NewsItem";
import { apiGet } from "../services_access/apiClient";
import { useRealtime, RealtimeMessage } from "./useRealtime";

/** צבעי הפרויקט */
const COLORS = ["#00bfff", "#1e90ff", "#40e0d0", "#ffa500", "#ffb6c1", "#9370db", "#ffdab9"];

/**
 * News item decorated with UI animation and color flags.
 */
export interface AnimatedNewsItem extends NewsItem {
  animate?: boolean; // smooth fade-in animation
  color?: string;    // project-themed color
}

/**
 * Type for the custom hook result.
 */
export interface UseNewsFeedResult {
  newsItems: AnimatedNewsItem[];
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

/**
 * useNewsFeed Hook
 *
 * Powers the main News Feed experience:
 * - Fetches news from backend
 * - Adds UI animation & color coding
 * - Merges real-time notifications
 */
export function useNewsFeed(): UseNewsFeedResult {
  const [newsItems, setNewsItems] = useState<AnimatedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /** Realtime notifications */
  const { messages } = useRealtime<NewsItem>("/news/stream");

  /** Fetch news from backend */
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await apiGet<NewsItem[]>("/news");

      // Assign colors and animation flags
      const animated = data.map((item, index) => ({
        ...item,
        animate: true,
        color: COLORS[index % COLORS.length],
      }));

      setNewsItems(animated);

      // Remove animation after fade-in
      setTimeout(() => {
        setNewsItems((prev) =>
          prev.map((item) => ({ ...item, animate: false }))
        );
      }, 650);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Integrate realtime messages */
  useEffect(() => {
    messages.forEach((msg: RealtimeMessage<NewsItem>) => {
      if (msg.type === "new_news") {
        const newItem: AnimatedNewsItem = {
          ...msg.payload,
          animate: true,
          color: COLORS[newsItems.length % COLORS.length],
        };
        setNewsItems((prev) => [newItem, ...prev]);

        // Remove animation flag after fade-in
        setTimeout(() => {
          setNewsItems((prev) =>
            prev.map((item) => ({ ...item, animate: false }))
          );
        }, 650);
      }
    });
  }, [messages, newsItems.length]);

  /** Initial fetch */
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    newsItems,
    loading,
    error,
    refresh: fetchNews,
  };
}
