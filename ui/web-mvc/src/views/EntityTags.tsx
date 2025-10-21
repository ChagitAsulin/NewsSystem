//export default function EntityTags(){ return <div>EntityTags</div> }

// src/views/EntityTags.tsx
import React from "react";

interface EntityTag {
  /** The name of the entity (e.g., person, location, organization) */
  name: string;
  /** The type/category of the entity (e.g., 'Person', 'Location', 'Organization') */
  type: string;
}

interface EntityTagsProps {
  /** Array of entities to display as tags */
  entities: EntityTag[];
}

/**
 * EntityTags component
 *
 * Displays a list of entities as small, styled tags.
 * Typically used inside a NewsCard or NewsDetails component
 * to show related persons, locations, or organizations.
 *
 * @param entities - Array of entity objects to render
 */
const EntityTags: React.FC<EntityTagsProps> = ({ entities }) => {
  if (!entities || entities.length === 0) {
    return null; // No entities to display
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {entities.map((entity, index) => (
        <span
          key={index}
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            entity.type === "Person"
              ? "bg-blue-100 text-blue-800"
              : entity.type === "Location"
              ? "bg-green-100 text-green-800"
              : entity.type === "Organization"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
          title={entity.type}
        >
          {entity.name}
        </span>
      ))}
    </div>
  );
};

export default EntityTags;
