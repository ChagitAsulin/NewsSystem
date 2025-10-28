//export default function NewsDetails(){ return <div>NewsDetails</div> }

// src/views/NewsDetails.tsx
import React from "react";
import { NewsItem } from "../models/domain/NewsItem";
import EntityTags from "./EntityTags";

interface NewsDetailsProps {
  news: NewsItem;
}

const NewsDetails: React.FC<NewsDetailsProps> = ({ news }) => {
  if (!news) {
    return <div className="text-center text-gray-500 py-8">No news selected.</div>;
  }

  return (
    <article className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      {news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      )}

      <h1 className="text-2xl font-bold mb-2">{news.title}</h1>

      <p className="text-sm text-gray-500 mb-4">
        {news.topics[0] || news.classification} •{" "}
        {new Date(news.createdAt).toLocaleString("he-IL")}
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">{news.summary}</p>

      {news.entities.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Entities</h2>
          <EntityTags entities={news.entities} />
        </div>
      )}
    </article>
  );
};

export default NewsDetails;
