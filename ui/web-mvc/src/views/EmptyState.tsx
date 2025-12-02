//export default function EmptyState(){ return <div>EmptyState</div> }

import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title?: string;
  description?: string;
  iconUrl?: string;
}

/**
 * EmptyState component with colorful gradient and animation
 */
const EmptyState: React.FC<EmptyStateProps> = ({ title = "Nothing here yet", description, iconUrl }) => {
  return (
    <motion.div className="flex flex-col items-center justify-center p-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {iconUrl && (
        <motion.img
          src={iconUrl}
          alt="Empty state icon"
          className="w-24 h-24 mb-4"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
        {title}
      </h2>
      {description && (
        <motion.p className="mt-2 text-gray-500" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default EmptyState;
