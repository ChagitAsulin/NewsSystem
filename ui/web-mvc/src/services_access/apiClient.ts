
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

// src/services_access/apiClient.ts

/**
 * apiClient - Unified HTTP client for communicating with the backend API.
 * Provides convenient methods: get, post, put, delete.
 * Automatically uses NEXT_PUBLIC_API_BASE_URL from environment variables.
 * Handles JSON serialization/deserialization and error reporting.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }
  return text ? JSON.parse(text) : ({} as T);
}

async function buildUrl(path: string, params?: Record<string, any>): Promise<string> {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  }
  return url.toString();
}

export const apiClient = {
  /**
   * Send a GET request
   * @param path API path
   * @param params Optional query parameters
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = await buildUrl(path, params);
    const res = await fetch(url, { credentials: "include" });
    return handleResponse<T>(res);
  },

  /**
   * Send a POST request
   * @param path API path
   * @param body Optional request body
   */
  async post<T>(path: string, body?: any): Promise<T> {
    const url = await buildUrl(path);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  /**
   * Send a PUT request
   * @param path API path
   * @param body Optional request body
   */
  async put<T>(path: string, body?: any): Promise<T> {
    const url = await buildUrl(path);
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  /**
   * Send a DELETE request
   * @param path API path
   * @param params Optional query parameters
   */
  async delete<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = await buildUrl(path, params);
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    return handleResponse<T>(res);
  },
};

// Backwards compatibility exports (optional)
export const apiGet = apiClient.get;
export const apiPost = apiClient.post;
export const apiPut = apiClient.put;
export const apiDelete = apiClient.delete;
