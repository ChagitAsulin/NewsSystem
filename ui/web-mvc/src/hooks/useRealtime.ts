//export function useRealtime(){ return null; }

// src/hooks/useRealtime.ts

import { useEffect, useRef, useState } from "react";
import { apiSSE } from "../services_access/apiClient";

/**
 * Shape of a realtime SSE event coming from the backend.
 */
export interface RealtimeMessage<T> {
  type: string;
  payload: T;
}

/**
 * useRealtime
 *
 * Establishes an SSE (Server-Sent Events) connection to a backend stream.
 * Automatically handles reconnection, incoming messages,
 * cleanup on unmount, and provides typed realtime events.
 */
export function useRealtime<T>(path: string) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [messages, setMessages] = useState<RealtimeMessage<T>[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = apiSSE<T>(path);
    eventSourceRef.current = es;
    setConnected(true);

    // Handle incoming SSE messages
    es.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data) as RealtimeMessage<T>;
        setMessages((prev) => [...prev, parsed]);
      } catch (error) {
        console.error("Invalid SSE message:", error);
      }
    };

    // Connection error handler
    es.onerror = (error: Event) => {
      console.error("SSE Error:", error);
      setConnected(false);
    };

    // Cleanup on unmount
    return () => {
      es.close();
      setConnected(false);
    };
  }, [path]);

  return {
    messages,
    connected,
  };
}
