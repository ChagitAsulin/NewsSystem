
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
 * Provides GET, POST, PUT, DELETE, and SSE support.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Builds a full URL with optional query parameters.
 * @param path Relative API path (e.g., "/news")
 * @param params Optional query parameters
 * @returns Full URL string
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  const url = new URL(path, BASE_URL);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  console.info(`apiClient: built URL -> ${url.toString()}`);
  return url.toString();
}

/**
 * Handles fetch responses: parses JSON and throws errors if response not ok.
 * @param res Fetch Response object
 * @returns Parsed JSON of type T
 * @throws Error if HTTP status not ok or invalid JSON
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    console.error(`apiClient Error ${res.status}: ${text || res.statusText}`);
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("apiClient: Failed to parse JSON:", error);
    throw new Error("Invalid JSON returned from server");
  }
}

/** API client with REST methods */
export const apiClient = {
  /**
   * Performs GET request
   * @param path API path
   * @param params Optional query params
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    console.info(`apiClient.get called: ${path}`);
    const res = await fetch(buildUrl(path, params), { method: "GET", credentials: "include" });
    return handleResponse<T>(res);
  },

  /**
   * Performs POST request
   * @param path API path
   * @param body Optional body object
   */
  async post<T>(path: string, body?: any): Promise<T> {
    console.info(`apiClient.post called: ${path}`, body);
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  /**
   * Performs PUT request
   * @param path API path
   * @param body Optional body object
   */
  async put<T>(path: string, body?: any): Promise<T> {
    console.info(`apiClient.put called: ${path}`, body);
    const res = await fetch(buildUrl(path), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  /**
   * Performs DELETE request
   * @param path API path
   * @param params Optional query params
   */
  async delete<T>(path: string, params?: Record<string, any>): Promise<T> {
    console.info(`apiClient.delete called: ${path}`);
    const res = await fetch(buildUrl(path, params), { method: "DELETE", credentials: "include" });
    return handleResponse<T>(res);
  },
};

/** Shorthand exports */
export const apiGet = apiClient.get;
export const apiPost = apiClient.post;
export const apiPut = apiClient.put;
export const apiDelete = apiClient.delete;

/**
 * Creates a Server-Sent Events (SSE) connection
 * @param path API path
 * @param params Optional query params
 * @returns EventSource object
 */
export function apiSSE<T>(path: string, params?: Record<string, any>): EventSource {
  const url = new URL(path, BASE_URL);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  console.info(`apiClient: SSE connected to ${url.toString()}`);
  return new EventSource(url.toString(), { withCredentials: true });
}
