//export default function NewsDetails(){ return <div>NewsDetails</div> }

import React from "react";
import { NewsItem } from "../models/domain/NewsItem";
import EntityTags from "./EntityTags";
import { motion } from "framer-motion";

interface NewsDetailsProps {
  news: NewsItem;
}

const NewsDetails: React.FC<NewsDetailsProps> = ({ news }) => {
  if (!news) return <motion.div className="text-center text-gray-500 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No news selected.</motion.div>;

  return (
    <motion.article className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
      {news.imageUrl && <motion.img src={news.imageUrl} alt={news.title} className="w-full h-64 object-cover rounded-xl mb-4" whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} />}
      <motion.h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 bg-clip-text text-transparent" whileHover={{ color: "#2563EB" }} transition={{ duration: 0.3 }}>
        {news.title}
      </motion.h1>
      <p className="text-sm text-gray-500 mb-4">{news.topics[0] || news.classification} • {new Date(news.createdAt).toLocaleString("he-IL")}</p>
      <motion.p className="text-gray-700 leading-relaxed mb-6" whileHover={{ color: "#4B5563" }} transition={{ duration: 0.3 }}>{news.summary}</motion.p>
      {news.entities.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Entities</h2>
          <EntityTags entities={news.entities} />
        </div>
      )}
    </motion.article>
  );
};

export default NewsDetails;
