//export default function TopicPicker(){ return <div>TopicPicker</div> }

// src/views/TopicPicker.tsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../services_access/apiClient";

/**
 * TopicPickerProps
 * - onTopicsChange: optional callback to notify parent of the current selection
 * - initialSelected: optional initial selection (useful when loading user settings)
 */
interface TopicPickerProps {
  onTopicsChange?: (topics: string[]) => void;
  initialSelected?: string[];
}

/**
 * TopicPicker
 *
 * Fetches available topics from the backend and presents them as selectable pills.
 * Handles optimistic UI and posts subscription updates to the server.
 *
 * Notes:
 * - Uses apiGet('/topics') to fetch the canonical list of topics.
 * - Uses a POST to '/topics/subscribe' to update subscription (apiPost or fetch fallback).
 */
const TopicPicker: React.FC<TopicPickerProps> = ({ onTopicsChange, initialSelected = [] }) => {
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialSelected);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available topics on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet<string[]>("/topics");
        if (mounted) {
          setAvailableTopics(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch topics", err);
        if (mounted) setError("Failed to load topics");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Utility: POST subscription update (uses apiPost if exists, otherwise fetch)
  const postSubscription = async (topics: string[]) => {
    const body = { topics };
    // try to use apiPost if exported
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const apiClient = require("../services_access/apiClient");
      if (typeof apiClient.apiPost === "function") {
        return await apiClient.apiPost("/topics/subscribe", body);
      }
    } catch (_) {
      // fall through to fetch fallback
    }

    // fetch fallback:
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${base}/topics/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`POST /topics/subscribe -> ${res.status}`);
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Toggle a topic selection (optimistic)
  const toggleTopic = async (topic: string) => {
    setError(null);
    const isSelected = selectedTopics.includes(topic);
    const updated = isSelected ? selectedTopics.filter((t) => t !== topic) : [...selectedTopics, topic];
    setSelectedTopics(updated);
    onTopicsChange?.(updated);

    // save to backend (best-effort). show saving indicator.
    try {
      setSaving(true);
      await postSubscription(updated);
    } catch (err) {
      console.error("Failed to update subscriptions", err);
      setError("Failed to save subscriptions. Reverting selection.");
      // revert optimistic change on failure
      setSelectedTopics(isSelected ? [...selectedTopics, topic] : selectedTopics.filter((t) => t !== topic));
      onTopicsChange?.(selectedTopics);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading topics...</div>;
  if (error) return <div className="text-sm text-red-600">Error: {error}</div>;

  return (
    <div className="topic-picker flex flex-wrap gap-2 items-center">
      {availableTopics.length === 0 && <div className="text-sm text-gray-500">No topics available.</div>}

      {availableTopics.map((topic) => {
        const isSelected = selectedTopics.includes(topic);
        return (
          <button
            key={topic}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggleTopic(topic)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none
              ${isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            title={isSelected ? `Unsubscribe from ${topic}` : `Subscribe to ${topic}`}
          >
            {topic}
          </button>
        );
      })}

      {saving && <div className="ml-2 text-xs text-gray-500">Saving…</div>}
    </div>
  );
};

export default TopicPicker;
