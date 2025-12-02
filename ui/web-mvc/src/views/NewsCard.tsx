//export default function NewsCard(){ return <div>NewsCard</div> }

import React from "react";
import { NewsItem } from "../models/domain/NewsItem";
import { motion } from "framer-motion";

interface NewsCardProps {
  item: NewsItem;
}

const topicColor = (topic: string) => {
  const colors = [
    "bg-cyan-400", "bg-blue-500", "bg-teal-400", 
    "bg-orange-400", "bg-pink-400", "bg-purple-500"
  ];
  const index = topic.charCodeAt(0) % colors.length;
  return colors[index];
};

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform-gpu"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 15px 25px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.4 }}
    >
      {item.imageUrl && (
        <motion.img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <div className="p-4 flex flex-col flex-1">
        {item.topics[0] && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${topicColor(item.topics[0])} inline-block mb-2`}
          >
            {item.topics[0]}
          </span>
        )}

        <motion.h2
          className="text-lg font-bold mb-2 text-cyan-800"
          whileHover={{ color: "#2563EB" }}
          transition={{ duration: 0.3 }}
        >
          {item.title}
        </motion.h2>

        <motion.p
          className="text-gray-600 text-sm line-clamp-3"
          whileHover={{ color: "#4B5563" }}
          transition={{ duration: 0.3 }}
        >
          {item.summary}
        </motion.p>

        <div className="mt-2 text-xs text-gray-400">
          {new Date(item.createdAt).toLocaleDateString("he-IL")}
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
