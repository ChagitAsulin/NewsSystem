//export default function DashboardView(){ return <div>DashboardView</div> }

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
 * Main dashboard for displaying news feed with live updates and colorful UI
 */
const DashboardView: React.FC = () => {
  const { newsItems, loading, error, refresh }: UseNewsFeedResult = useNewsFeed();
  const [liveUpdates, setLiveUpdates] = useState<NewsItem[]>([]);

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

  const handleRefresh = () => refresh();

  if (loading)
    return (
      <motion.div className="text-center mt-10 text-lg text-cyan-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        🔄 Loading news...
      </motion.div>
    );

  if (error)
    return <EmptyState title="Failed to load news" description="An error occurred while fetching news." iconUrl="/images/error-icon.svg" />;

  if (!combinedNews.length)
    return <EmptyState title="No news available" description="Try selecting another topic or check back later." iconUrl="/images/empty-news.png" />;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <TopicPicker />
        <motion.button
          onClick={handleRefresh}
          className="px-5 py-2 bg-teal-400 text-white font-semibold rounded-lg shadow hover:bg-teal-500 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Refresh
        </motion.button>
      </div>

      <StreamPanel streamUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/sse`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {combinedNews.map((item: NewsItem) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardView;
