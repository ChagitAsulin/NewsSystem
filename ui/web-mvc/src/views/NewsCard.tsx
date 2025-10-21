//export default function NewsCard(){ return <div>NewsCard</div> }

// src/views/NewsCard.tsx
import React from "react";

/**
 * Props for the NewsCard component
 */
export interface NewsCardProps {
  /** Title of the news article */
  title: string;
  /** Topic or category of the news article */
  topic: string;
  /** URL of the article image (Cloudinary or other source) */
  imageUrl: string;
  /** Publication date in ISO format */
  publishedAt: string;
  /** Summary text of the news article */
  summary: string;
}

/**
 * NewsCard component
 *
 * A single card displaying one news article.
 * Shows the image, topic, title, summary, and publication date.
 *
 * Example usage:
 * ```tsx
 * <NewsCard
 *   title="AI Revolution in Cloud Computing"
 *   topic="Technology"
 *   imageUrl="https://example.com/news.jpg"
 *   publishedAt="2025-10-19T10:00:00Z"
 *   summary="Experts predict that AI will redefine how cloud systems operate."
 * />
 * ```
 */
const NewsCard: React.FC<NewsCardProps> = ({
  title,
  topic,
  imageUrl,
  publishedAt,
  summary,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Article Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        {/* Topic */}
        <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
          {topic}
        </span>

        {/* Title */}
        <h2 className="mt-2 text-xl font-bold text-gray-800">{title}</h2>

        {/* Summary */}
        <p className="text-gray-500 text-sm mt-1">{summary}</p>

        {/* Publication Date */}
        <div className="text-xs text-gray-400 mt-2">
          {new Date(publishedAt).toLocaleDateString("he-IL")}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
