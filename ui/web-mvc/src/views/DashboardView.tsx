//export default function DashboardView(){ return <div>DashboardView</div> }

// src/views/DashboardView.tsx
import React from "react";
import { useNewsFeed } from "../hooks/useNewsFeed";
import NewsCard from "./NewsCard";
import EmptyState from "./EmptyState";
import EntityTags from "./EntityTags";
import { NewsItem } from "../models/domain/NewsItem";

/**
 * DashboardView Component
 * 
 * מציג את הפיד הראשי של חדשות:
 * - רשימת כרטיסיות חדשות
 * - תגים של ישויות עבור כל חדשות (אם קיימים)
 * - מצב ריק אם אין חדשות
 */
const DashboardView: React.FC = () => {
  const { newsItems, loading, error } = useNewsFeed();

  if (loading) {
    return <div className="text-center mt-10">Loading news...</div>;
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load news"
        description="There was an error fetching news from the server."
      />
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return <EmptyState title="No news available" description="Check back later or try another topic." />;
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsItems.map((item: NewsItem) => (
        <div key={item.id} className="flex flex-col">
          <NewsCard item={item} />
          {item.entities && item.entities.length > 0 && (
            <EntityTags entities={item.entities} />
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardView;
