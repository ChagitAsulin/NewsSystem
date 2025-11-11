//export default function DashboardView(){ return <div>DashboardView</div> }

// src/views/DashboardView.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useNewsFeed, UseNewsFeedResult } from "../hooks/useNewsFeed";
import NewsCard from "./NewsCard";
import EmptyState from "./EmptyState";
import EntityTags from "./EntityTags";
import TopicPicker from "./TopicPicker";
import StreamPanel from "./StreamPanel";
import { NewsItem } from "../models/domain/NewsItem";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DashboardView Component
 * 
 * Modern, visually appealing dashboard:
 * - Topic selection via TopicPicker
 * - News feed with images and summaries
 * - Real-time updates via SSE + StreamPanel
 * - Entity tags for each news item
 * - Loading, error, and empty states
 * - Refresh button for manual reload
 * - Animated card entrance and hover effects
 */
const DashboardView: React.FC = () => {
  const { newsItems, loading, error, refresh }: UseNewsFeedResult = useNewsFeed();
  const [liveUpdates, setLiveUpdates] = useState<NewsItem[]>([]);

  // SSE real-time updates
  useEffect(() => {
    const streamUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/sse`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const data: NewsItem = JSON.parse(event.data);
        setLiveUpdates((prev) => [data, ...prev]);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const combinedNews = [...liveUpdates, ...(newsItems || [])];

  const handleRefresh = () => {
    refresh();
  };

  if (loading) return <div className="text-center mt-10 text-lg">🔄 Loading news...</div>;
  if (error)
    return (
      <EmptyState
        title="Failed to load news"
        description="An error occurred while fetching news. Please try again later."
      />
    );
  if (!combinedNews.length)
    return (
      <EmptyState
        title="No news available"
        description="Try selecting another topic or check back later."
      />
    );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Topic picker + Refresh */}
      <div className="flex items-center justify-between mb-6">
        <TopicPicker />
        <button
          onClick={handleRefresh}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Real-time stream panel */}
      <StreamPanel
        streamUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/sse`}
      />

      {/* News grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {combinedNews.map((item: NewsItem) => (
            <motion.div
              key={item.id}
              className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              layout
            >
              {/* Optional image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-3">{item.summary}</p>
                {item.entities && item.entities.length > 0 && (
                  <EntityTags entities={item.entities} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardView;
