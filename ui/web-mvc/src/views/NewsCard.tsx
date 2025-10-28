//export default function NewsCard(){ return <div>NewsCard</div> }

// src/views/NewsCard.tsx
import React from "react";
import { NewsItem } from "../models/domain/NewsItem";

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
          {item.topics[0] || item.classification}
        </span>

        <h2 className="mt-2 text-xl font-bold text-gray-800">{item.title}</h2>
        <p className="text-gray-500 text-sm mt-1">{item.summary}</p>

        <div className="text-xs text-gray-400 mt-2">
          {new Date(item.createdAt).toLocaleDateString("he-IL")}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
