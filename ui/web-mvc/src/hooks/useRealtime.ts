//export function useRealtime(){ return null; }

import { useEffect, useRef, useState } from "react";

/**
 * Shape of a realtime SSE event coming from the backend.
 */
export interface RealtimeMessage<T> {
  type: string;
  payload: T;
}

/**
 * useRealtime Hook
 *
 * Establishes a typed SSE connection to a backend stream.
 * Handles reconnection, incoming messages, and cleanup on unmount.
 */
export function useRealtime<T>(path: string) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [messages, setMessages] = useState<RealtimeMessage<T>[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let retryTimeout: number | null = null;

    const connect = () => {
      const es = new EventSource(path);
      eventSourceRef.current = es;
      setConnected(true);

      es.onmessage = (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data) as RealtimeMessage<T>;
          setMessages((prev) => [...prev, parsed]);
        } catch (error) {
          console.error("Invalid SSE message:", error);
        }
      };

      es.onerror = () => {
        console.error("SSE connection error, retrying...");
        setConnected(false);
        es.close();

        // Retry connection after 2 seconds
        retryTimeout = window.setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      setConnected(false);
    };
  }, [path]);

  return {
    messages,
    connected,
  };
}
