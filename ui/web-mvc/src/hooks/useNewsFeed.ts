//export function useNewsFeed(){ return []; }

// src/hooks/useNewsFeed.ts
import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "../models/domain/NewsItem";
import { apiGet } from "../services_access/apiClient";

/**
 * Type for the custom hook result
 */
export interface UseNewsFeedResult {
  newsItems: NewsItem[];
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

/**
 * useNewsFeed Hook
 * 
 * Fetches news from the API, provides loading and error states,
 * supports manual refresh of the news feed.
 */
export function useNewsFeed(): UseNewsFeedResult {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await apiGet<NewsItem[]>("/news");
      setNewsItems(data);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { newsItems, loading, error, refresh: fetchNews };
}
