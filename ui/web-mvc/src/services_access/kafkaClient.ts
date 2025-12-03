/*

export function connectNotificationsSSE(url: string, onMessage: (ev: MessageEvent)=>void){
  const es = new EventSource(url);
  es.onmessage = onMessage;
  return () => es.close();
}

*/

/**
 * Connect to SSE notifications
 * @param url SSE endpoint
 * @param onMessage Callback for message event
 * @returns Function to close the connection
 */
export function connectNotificationsSSE(
  url: string,
  onMessage: (ev: MessageEvent) => void
): () => void {
  console.info(`kafkaClient: connecting SSE -> ${url}`);
  const es = new EventSource(url, { withCredentials: true });
  es.onmessage = onMessage;
  return () => {
    console.info(`kafkaClient: closing SSE -> ${url}`);
    es.close();
  };
}
