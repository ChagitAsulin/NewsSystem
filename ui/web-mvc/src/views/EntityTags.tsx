//export default function EntityTags(){ return <div>EntityTags</div> }

import React from "react";
import { motion } from "framer-motion";
import { Entity } from "../models/domain/NewsItem";

export interface EntityTagsProps {
  entities: Entity[];
}

const EntityTags: React.FC<EntityTagsProps> = ({ entities }) => {
  const getTypeClass = (type: Entity["type"]) => {
    switch (type) {
      case "person":
        return "bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-500 text-white";
      case "location":
        return "bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-400 text-white";
      case "org":
        return "bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 text-white";
      case "misc":
      default:
        return "bg-gradient-to-r from-pink-300 via-purple-400 to-purple-500 text-white";
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {entities.map((entity, idx) => (
        <motion.span
          key={idx}
          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${getTypeClass(entity.type)}`}
          title={`Type: ${entity.type}`}
          whileHover={{ scale: 1.2, rotate: [0, 3, -3, 0], boxShadow: "0px 4px 12px rgba(0,0,0,0.25)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
          {entity.value}
        </motion.span>
      ))}
    </div>
  );
};

export default EntityTags;
