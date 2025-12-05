//export default function EntityTags(){ return <div>EntityTags</div> }

// src/views/EntityTags.tsx
import React from "react";
import { Entity } from "../models/domain/NewsItem";

export interface EntityTagsProps {
  entities: Entity[];
}

const EntityTags: React.FC<EntityTagsProps> = ({ entities }) => {
  const getTypeClass = (type: Entity["type"]) => {
    switch (type) {
      case "person":
        return "bg-blue-100 text-blue-800";
      case "location":
        return "bg-green-100 text-green-800";
      case "org":
        return "bg-purple-100 text-purple-800";
      case "misc":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {entities.map((entity, idx) => (
        <span
          key={idx}
          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeClass(entity.type)}`}
          title={`Type: ${entity.type}`}
        >
          {entity.value}
        </span>
      ))}
    </div>
  );
};

export default EntityTags;
