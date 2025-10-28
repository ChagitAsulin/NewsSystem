//export function useNewsFeed(){ return []; }

// src/hooks/useNewsFeed.ts
import { useState, useEffect } from "react";
import { NewsItem } from "../models/domain/NewsItem";
import { apiGet } from "../services_access/apiClient";

interface UseNewsFeedResult {
  newsItems: NewsItem[];
  loading: boolean;
  error: boolean;
}

/**
 * Hook to fetch the news feed from the API
 */
export function useNewsFeed(): UseNewsFeedResult {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await apiGet<NewsItem[]>("/news");
        setNewsItems(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return { newsItems, loading, error };
}
