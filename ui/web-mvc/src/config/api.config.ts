//export const API_BASE=process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * @file api.config.ts
 * @description Centralized configuration for all API calls. Provides BASE_URL and default settings.
 * Ensures consistent API request structure across the application.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

/**
 * Default headers for all API requests.
 * Can be extended or overridden per request.
 */
export const API_DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Default timeout for API requests in milliseconds.
 * Helps prevent hanging requests and improves UX.
 */
export const API_TIMEOUT = 10000;

/**
 * Default query parameters for all requests (optional).
 */
export const API_DEFAULT_PARAMS: Record<string, any> = {};
