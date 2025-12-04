//export default function NewsItem(){ return <div>News details</div> }

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useNewsController } from "@/controllers/useNewsController";
import { NotificationsController } from "@/controllers/NotificationsController";
import EntityTags from "@/views/EntityTags";
import { NewsItemDTO, EntityDTO } from "@/models/dto/NewsItemDTO";
import { NotificationDTO } from "@/models/dto/NotificationDTO";
import { Entity, EntityType } from "@/models/domain/Entity";

/**
 * NewsItemPage
 * ----------------
 * Page component displaying a single news item with image, summary, entities, and notifications.
 */
export default function NewsItemPage() {
  const params = useParams();
  // Handle Next.js params which can be string | string[] | undefined
  const newsId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { fetchNewsById } = useNewsController();
  const notificationsController = new NotificationsController();

  const [newsItem, setNewsItem] = useState<NewsItemDTO | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!newsId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch news item
        const news = await fetchNewsById(newsId);
        setNewsItem(news);

        // Fetch related notifications
        const notifs = await notificationsController.fetchNotificationsForNews(newsId);
        setNotifications(notifs);
      } catch (err) {
        console.error("Failed to fetch news or notifications:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [newsId, fetchNewsById]);

  if (!newsId) return <div>Invalid news ID</div>;
  if (loading) return <div>Loading...</div>;
  if (error || !newsItem) return <div>Failed to load news item.</div>;

  // Convert DTO entities to domain entities
  const entities: Entity[] = newsItem.entities
    ? newsItem.entities.map((e: EntityDTO) => ({
        type: e.type as EntityType, // assert to EntityType
        value: e.name,
        confidence: e.confidence,
      }))
    : [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{newsItem.title}</h1>

      {newsItem.image_public_id && (
        <img
          src={`https://res.cloudinary.com/<your-cloud-name>/image/upload/${newsItem.image_public_id}.jpg`}
          alt={newsItem.title}
          className="w-full max-h-80 object-cover rounded-lg mb-4"
        />
      )}

      <p className="mb-4">{newsItem.summary || newsItem.content}</p>

      {entities.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Entities:</h3>
          <EntityTags entities={entities} />
        </div>
      )}

      {notifications.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Notifications:</h3>
          <ul className="list-disc list-inside">
            {notifications.map((n) => (
              <li key={n.id}>
                <span className="font-medium">{n.title}</span> - {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
