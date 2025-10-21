//export default function EmptyState(){ return <div>EmptyState</div> }

// src/views/EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  /** 
   * Title to display when the list is empty. 
   * Example: "No news available"
   */
  title?: string;

  /** 
   * Optional description to give more context. 
   * Example: "Please check back later or change your filters."
   */
  description?: string;

  /** 
   * Optional icon URL to visually represent empty state. 
   * Example: "/icons/empty.svg"
   */
  iconUrl?: string;
}

/**
 * EmptyState component
 * 
 * This component is used to show a friendly message when there is no data to display.
 * Can be used in a news feed, topic list, or any section where an empty state is meaningful.
 *
 * Props:
 * - title: Main message to show (optional, default: "Nothing here yet")
 * - description: Additional information (optional)
 * - iconUrl: URL of an icon to display (optional)
 *
 * Example usage:
 * <EmptyState 
 *    title="No articles found"
 *    description="Try selecting a different topic."
 *    iconUrl="/images/empty-news.png"
 * />
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  description,
  iconUrl,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
      {iconUrl && (
        <img
          src={iconUrl}
          alt="Empty state icon"
          className="w-24 h-24 mb-4"
        />
      )}
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-sm">{description}</p>}
    </div>
  );
};

export default EmptyState;

