/*

export function connectNotificationsSSE(url: string, onMessage: (ev: MessageEvent)=>void){
  const es = new EventSource(url);
  es.onmessage = onMessage;
  return () => es.close();
}

*/

/**
 * @file kafkaClient.ts
 * @description Handles real-time notifications via Server-Sent Events (SSE).
 * Provides a lightweight wrapper to connect and disconnect from SSE streams.
 */

export function connectNotificationsSSE(
  url: string,
  onMessage: (ev: MessageEvent) => void
): () => void {
  /**
   * Connects to SSE server at the given URL.
   * @param url - Full URL to SSE endpoint
   * @param onMessage - Callback for each message received
   * @returns A function to close the SSE connection
   */
  const es = new EventSource(url, { withCredentials: true });
  es.onmessage = onMessage;

  // Can add error, reconnect logic here if needed

  return () => es.close();
}
