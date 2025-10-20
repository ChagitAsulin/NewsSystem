'use client';

import useSWR from 'swr';

const API = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardView() {
  const { data: news, error: newsErr, isLoading: newsLoading } =
    useSWR(`${API}/news?limit=20`, fetcher, { refreshInterval: 10000 });

  const { data: notifs, error: notifsErr, isLoading: notifsLoading } =
    useSWR(`${API}/notifications?limit=20`, fetcher, { refreshInterval: 10000 });

  if (newsErr || notifsErr) return <div>שגיאה בטעינת נתונים</div>;
  if (newsLoading || notifsLoading) return <div>טוען…</div>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <h2>News (enriched_news)</h2>
      <ul>
        {news?.map((n: any) => (
          <li key={n.id}>
            <b>{n.title}</b> — {n.topic} — {n.published_at}
          </li>
        ))}
      </ul>

      <h2>Notifications</h2>
      <ul>
        {notifs?.map((n: any) => (
          <li key={n.id}>
            <b>{n.title}</b> — {n.topic}
          </li>
        ))}
      </ul>
    </main>
  );
}