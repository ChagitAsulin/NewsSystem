//export default function TopicPicker(){ return <div>TopicPicker</div> }

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet } from "../services_access/apiClient";

interface TopicPickerProps {
  onTopicsChange?: (topics: string[]) => void;
  initialSelected?: string[];
}

const topicColor = (topic: string, selected: boolean) => {
  const colors = [
    "bg-cyan-400", "bg-blue-500", "bg-teal-400",
    "bg-orange-400", "bg-pink-400", "bg-purple-500"
  ];
  const index = topic.charCodeAt(0) % colors.length;
  return selected ? colors[index] : "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

const TopicPicker: React.FC<TopicPickerProps> = ({ onTopicsChange, initialSelected = [] }) => {
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialSelected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet<string[]>("/topics");
        if (mounted) setAvailableTopics(data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load topics");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const toggleTopic = async (topic: string) => {
    setError(null);
    const isSelected = selectedTopics.includes(topic);
    const updated = isSelected ? selectedTopics.filter((t) => t !== topic) : [...selectedTopics, topic];
    setSelectedTopics(updated);
    onTopicsChange?.(updated);
    setSaving(true);
    setTimeout(() => setSaving(false), 500); // סימולציה
  };

  if (loading) return <div className="text-sm text-gray-500">Loading topics...</div>;
  if (error) return <div className="text-sm text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {availableTopics.map((topic) => {
        const isSelected = selectedTopics.includes(topic);
        return (
          <motion.button
            key={topic}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggleTopic(topic)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none ${topicColor(topic, isSelected)}`}
          >
            {topic}
          </motion.button>
        );
      })}
      {saving && <div className="ml-2 text-xs text-gray-500">Saving…</div>}
    </div>
  );
};

export default TopicPicker;
