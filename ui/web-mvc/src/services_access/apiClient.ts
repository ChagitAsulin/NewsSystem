
export async function apiGet<T>(path: string, params?: Record<string, any>): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = new URL(path, base);
  if (params) Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}
