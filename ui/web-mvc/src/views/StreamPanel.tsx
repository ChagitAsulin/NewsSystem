//export default function StreamPanel(){ return <div>StreamPanel</div> }

// src/views/StreamPanel.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import NewsCard from "./NewsCard";
import { NewsItem } from "../models/domain/NewsItem";
import { dbClient } from "../services_access/dbClient";

/**
 * StreamPanelProps
 * - streamUrl: SSE URL that sends notifications when a new news item arrives.
 *   The notification payload should be either the full NewsItem JSON or an object { id: string }.
 * - fetchOnId: if true, when the server sends { id } the component will call dbClient.getNewsById(id).
 */
interface StreamPanelProps {
  streamUrl: string;
  fetchOnId?: boolean;
}

/**
 * StreamPanel
 *
 * Connects to an SSE stream (EventSource) and maintains a list of NewsItem.
 * - supports automatic reconnect with exponential backoff
 * - deduplicates by id
 * - optionally fetches full news from DB when server sends only an id
 */
const StreamPanel: React.FC<StreamPanelProps> = ({ streamUrl, fetchOnId = true }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const esRef = useRef<EventSource | null>(null);
  const reconnectRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);

  // deduplicate helper
  const addOrUpdate = useCallback((item: NewsItem) => {
    setNewsItems((prev) => {
      // if exists, keep previous order but replace
      const exists = prev.findIndex((p) => p.id === item.id);
      if (exists !== -1) {
        const copy = [...prev];
        copy[exists] = item;
        // move to front
        const [found] = copy.splice(exists, 1);
        return [found, ...copy];
      }
      // new item: prepend
      return [item, ...prev].slice(0, 200); // keep cap
    });
  }, []);

  // fetch full NewsItem by id via dbClient (if needed)
  const ensureFetchById = useCallback(async (id: string) => {
    try {
      const item = await dbClient.getNewsById(id);
      if (item) addOrUpdate(item as unknown as NewsItem);
    } catch (err) {
      console.error("Failed to fetch news by id", id, err);
    }
  }, [addOrUpdate]);

  // connect function with exponential backoff on reconnect
  const connect = useCallback(() => {
    if (esRef.current) {
      try { esRef.current.close(); } catch (_) {}
      esRef.current = null;
    }

    setError(null);
    setLoading(true);

    const es = new EventSource(streamUrl);
    esRef.current = es;

    es.onopen = () => {
      reconnectRef.current = 0;
      setLoading(false);
      setError(null);
      // console.debug("SSE connection opened");
    };

    es.onmessage = async (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        // if server sends full news item
        if (payload && payload.id && payload.title) {
          addOrUpdate(payload as NewsItem);
        } else if (payload && payload.id && fetchOnId) {
          // server only sent id (common pattern) -> fetch
          await ensureFetchById(payload.id);
        } else {
          // unknown shape: ignore or log
          console.warn("Unknown SSE payload", payload);
        }
      } catch (err) {
        console.error("Failed to handle SSE message", err);
      }
    };

    es.onerror = () => {
      // try reconnect with backoff
      try { es.close(); } catch (_) {}
      esRef.current = null;
      if (!mountedRef.current) return;

      reconnectRef.current = Math.min(reconnectRef.current + 1, 8); // cap exponent
      const delay = Math.min(30000, 500 * 2 ** reconnectRef.current); // ms
      setError(`Disconnected. Reconnecting in ${Math.round(delay / 1000)}s`);
      setTimeout(() => {
        if (mountedRef.current) connect();
      }, delay);
    };
  }, [streamUrl, addOrUpdate, ensureFetchById, fetchOnId]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      try {
        esRef.current?.close();
      } catch (_) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl]); // reconnect when URL changes

  if (loading) return <div className="text-sm text-gray-500">Connecting to live stream…</div>;
  if (error && newsItems.length === 0) return <div className="text-sm text-red-600">Stream error: {error}</div>;

  return (
    <div className="stream-panel grid grid-cols-1 gap-4">
      {error && <div className="text-xs text-yellow-700">Warning: {error}</div>}
      {newsItems.length === 0 ? (
        <div className="text-sm text-gray-500">No live news yet.</div>
      ) : (
        newsItems.map((item) => (
          <div key={item.id} className="w-full">
            <NewsCard item={item} />
          </div>
        ))
      )}
    </div>
  );
};

export default StreamPanel;
