import { apiGet } from "./apiClient";
import type { NewsItemDTO } from "@/models/dto/NewsItemDTO";

export const dbClient = {
  getNewsById: async (id: string) => apiGet<NewsItemDTO>(`/news/${id}`),
  getLatestByTopics: async (topics: string[], limit = 50) =>
    apiGet<NewsItemDTO[]>("/news", { topics: topics.join(","), limit }),
};
