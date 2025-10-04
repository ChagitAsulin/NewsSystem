import { dbClient } from "@/services_access/dbClient";
import { mapNewsItem } from "@/adapters/newsMapper";

export const NewsRepository = {
  async getById(id: string) {
    const dto = await dbClient.getNewsById(id);
    return mapNewsItem(dto);
  },
  async getLatest(topics: string[], limit = 50) {
    const list = await dbClient.getLatestByTopics(topics, limit);
    return list.map(mapNewsItem);
  },
};
