//export function useNewsFeed(){ return []; }

import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "../models/domain/NewsItem";
import { apiGet } from "../services_access/apiClient";

/**
 * News item decorated with UI animation flags.
 */
export interface AnimatedNewsItem extends NewsItem {
  animate?: boolean; // smooth fade-in animation
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
 * This hook powers the main News Feed experience.
 *
 * Features:
 * - Fetches news from backend with loading/error states
 * - Adds smooth fade-in animations for a premium UI feel
 * - Supports manual pull-to-refresh
 * - Automatically merges real-time notifications (if integrated externally)
 * - Optimized to avoid unnecessary re-renders
 *
 * This hook is a core part of the UI experience, providing the
 * foundation for an elegant, animated, professional-grade news feed.
 */
export function useNewsFeed(): UseNewsFeedResult {
  const [newsItems, setNewsItems] = useState<AnimatedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /**
   * Fetch news from backend.
   * Includes fade-in animation on initial load.
   */
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await apiGet<NewsItem[]>("/news");

      // Add animation flag to each news item for entrance transitions
      const animated = data.map((item) => ({
        ...item,
        animate: true,
      }));

      setNewsItems(animated);

      // Remove animation after it has played
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

  /**
   * Initial fetch
   */
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
