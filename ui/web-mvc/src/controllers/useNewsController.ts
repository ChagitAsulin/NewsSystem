//export function useNewsController(){ return {}; }

import { useCallback } from "react";
import { apiGet } from "../services_access/apiClient";
import { NewsItemDTO } from "../models/dto/NewsItemDTO";

/**
 * useNewsController
 * Provides high-level actions for fetching news from the API.
 */
export function useNewsController() {
  /**
   * Fetch all news items from the server.
   * @returns Promise of array of NewsItemDTO
   */
  const fetchAllNews = useCallback(async (): Promise<NewsItemDTO[]> => {
    try {
      const news = await apiGet<NewsItemDTO[]>("/news");
      return news;
    } catch (error) {
      console.error("Failed to fetch news:", error);
      return [];
    }
  }, []);

  /**
   * Fetch a specific news article by its ID.
   * @param id News item identifier
   * @returns Promise of NewsItemDTO or null if not found
   */
  const fetchNewsById = useCallback(
    async (id: string): Promise<NewsItemDTO | null> => {
      try {
        const newsItem = await apiGet<NewsItemDTO>(`/news/${id}`);
        return newsItem;
      } catch (error) {
        console.error(`Failed to fetch news item with id ${id}:`, error);
        return null;
      }
    },
    []
  );

  return {
    fetchAllNews,
    fetchNewsById,
  };
}
