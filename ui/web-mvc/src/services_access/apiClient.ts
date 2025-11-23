
/*

export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = new URL(path, base);
  if (params) Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}
  
*/

/**
 * @file apiClient.ts
 * @description Unified, type-safe API client for the application.
 * Handles GET/POST/PUT/DELETE calls, JSON parsing, error handling, and SSE (Server-Sent Events).
 * Supports query parameters, credentials, and is fully ready for TypeScript projects.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Builds a complete URL with optional query parameters.
 * @param path - Relative API path (e.g., "/news")
 * @param params - Optional query parameters as key-value pairs
 * @returns Full URL string
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, String(value))
    );
  }
  return url.toString();
}

/**
 * Handles fetch Response, parses JSON, and throws structured errors.
 * @param res - Fetch Response object
 * @returns Parsed JSON of type T
 * @throws Error if HTTP status not ok or invalid JSON
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }

  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Invalid JSON returned from server");
  }
}

/**
 * REST API client: provides GET, POST, PUT, DELETE methods.
 */
export const apiClient = {
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = buildUrl(path, params);
    const res = await fetch(url, { method: "GET", credentials: "include" });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: any): Promise<T> {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: any): Promise<T> {
    const url = buildUrl(path);
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = buildUrl(path, params);
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    return handleResponse<T>(res);
  },
};

// Shorthand exports
export const apiGet = apiClient.get;
export const apiPost = apiClient.post;
export const apiPut = apiClient.put;
export const apiDelete = apiClient.delete;

/**
 * Creates a typed Server-Sent Events (SSE) connection.
 * Includes credentials and query parameters.
 * @param path - Relative API path
 * @param params - Optional query parameters
 * @returns EventSource object
 */
export function apiSSE<T>(
  path: string,
  params?: Record<string, any>
): EventSource {
  const url = new URL(path, BASE_URL);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  return new EventSource(url.toString(), { withCredentials: true });
}
