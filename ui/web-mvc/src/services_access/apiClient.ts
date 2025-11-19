
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
 * Unified, type-safe API client for the application.
 * Provides GET/POST/PUT/DELETE utilities + SSE streaming.
 * Ensures consistent URL building, JSON parsing, and error handling.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Builds a full URL with optional query parameters.
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
 * Parses server response as JSON and ensures type-safety.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }

  if (!text) {
    // Empty-body responses (204, 201 without body, etc.)
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Invalid JSON returned from server");
  }
}

/**
 * Standard REST API client (GET, POST, PUT, DELETE)
 */
export const apiClient = {
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = buildUrl(path, params);
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
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
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse<T>(res);
  },
};

// shorthand exports
export const apiGet = apiClient.get;
export const apiPost = apiClient.post;
export const apiPut = apiClient.put;
export const apiDelete = apiClient.delete;

/**
 * Creates a typed Server-Sent Events (SSE) connection.
 * Automatically includes credentials and query parameters.
 */
export function apiSSE<T>(
  path: string,
  params?: Record<string, any>
): EventSource {
  const url = new URL(path, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }

  return new EventSource(url.toString(), {
    withCredentials: true,
  });
}
