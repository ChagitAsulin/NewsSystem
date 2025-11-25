//export const NOTIFICATIONS_PATH='/sse/notifications';

/**
 * @file kafka.config.ts
 * @description Configuration for real-time notifications via SSE or Kafka.
 * Defines endpoints, retry policies, and topic paths for events.
 */

export const NOTIFICATIONS_PATH = "/sse/notifications";

/**
 * Default retry attempts for SSE/Kafka reconnection.
 */
export const SSE_RETRY_ATTEMPTS = 5;

/**
 * Event topics structure.
 * Easily extendable for new notification types.
 */
export const TOPICS = {
  NOTIFICATIONS: "notifications",
  ALERTS: "alerts",
  UPDATES: "updates",
};

/**
 * Optional: SSE/Kafka client options
 * Can be extended for Kafka brokers, clientId, etc.
 */
export const CLIENT_OPTIONS = {
  withCredentials: true,
  reconnectInterval: 3000, // 3 seconds between retries
};

