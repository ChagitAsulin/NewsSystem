'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';

const API = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
const fetcher = (url: string) => fetch(url).then(r => r.json());

// מיפוי נושאים לאייקון וצבע רקע
const TOPIC_META: Record<string, { label: string; emoji: string; bg: string }> = {
  World: { label: 'World', emoji: '🌍', bg: '#e3f2fd' },
  Politics: { label: 'Politics', emoji: '🏛️', bg: '#fce4ec' },
  Sports: { label: 'Sports', emoji: '🏅', bg: '#e8f5e9' },
  Tech: { label: 'Tech', emoji: '💻', bg: '#ede7f6' },
  Business: { label: 'Business', emoji: '💼', bg: '#fff3e0' },
  Other: { label: 'Other', emoji: '📰', bg: '#eeeeee' },
};

export default function DashboardView() {
  // כל ה-hooks חייבים להיות תמיד באותו סדר, בלי return לפני
  const {
    data: news,
    error: newsErr,
    isLoading: newsLoading,
  } = useSWR(`${API}/news?limit=20`, fetcher, { refreshInterval: 10000 });

  const {
    data: notifs,
    error: notifsErr,
    isLoading: notifsLoading,
  } = useSWR(`${API}/notifications?limit=20`, fetcher, {
    refreshInterval: 10000,
  });

  const uniqueNews = useMemo(
    () =>
      Array.from(new Map((news ?? []).map((n: any) => [n.id, n])).values()),
    [news]
  );

  const uniqueNotifs = useMemo(
    () =>
      Array.from(new Map((notifs ?? []).map((n: any) => [n.id, n])).values()),
    [notifs]
  );

  const [topicFilter, setTopicFilter] = useState<string>('all');

  const allTopics = useMemo(
    () =>
      Array.from(
        new Set(
          uniqueNews.flatMap((n: any) => (n.topics_hint ?? []) as string[])
        )
      ),
    [uniqueNews]
  );

  const filteredNews = useMemo(
    () =>
      topicFilter === 'all'
        ? uniqueNews
        : uniqueNews.filter((n: any) =>
            (n.topics_hint ?? []).includes(topicFilter)
          ),
    [uniqueNews, topicFilter]
  );

  // רק עכשיו מחזירים לפי מצב
  if (newsErr || notifsErr) return <div>שגיאה בטעינת נתונים</div>;
  if (newsLoading || notifsLoading) return <div>טוען…</div>;

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Dashboard 📰</h1>
      <p style={{ marginBottom: 24, color: '#555' }}>
        שידור חי של חדשות והתראות מהמערכת שלך.
      </p>

      {/* סינון לפי נושא */}
      <section
        style={{
          marginBottom: 24,
          padding: 12,
          borderRadius: 8,
          background: '#f5f5f5',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <span>סינון לפי נושא:</span>
        <select
          value={topicFilter}
          onChange={e => setTopicFilter(e.target.value)}
          style={{ padding: 6, borderRadius: 6 }}
        >
          <option value="all">הכול</option>
          {allTopics.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </section>

      {/* חדשות */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 12 }}>News (enriched_news)</h2>

        {filteredNews.length === 0 ? (
          <div>אין חדשות מתאימות למסנן.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 16,
            }}
          >
            {filteredNews.map((n: any) => {
              const mainTopic: string =
                (n.topics_hint && n.topics_hint[0]) || 'Other';
              const meta = TOPIC_META[mainTopic] ?? TOPIC_META.Other;

              const contentText = String(n.content ?? '');
              const snippet =
                contentText.length > 0
                  ? contentText.slice(0, 140) +
                    (contentText.length > 140 ? '…' : '')
                  : 'No summary available';

              return (
                <article
                  key={n.id}
                  style={{
                    borderRadius: 10,
                    padding: 16,
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #eee',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        lineHeight: 1.3,
                      }}
                    >
                      {n.title}
                    </h3>

                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 12,
                        background: meta.bg,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {meta.emoji} {meta.label}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '4px 0 8px',
                      fontSize: 14,
                      color: '#444',
                    }}
                  >
                    {snippet}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: '#777',
                    }}
                  >
                    <span>
                      {n.published_at
                        ? new Date(n.published_at).toLocaleString()
                        : ''}
                    </span>

                    {n.url && (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'underline' }}
                      >
                        לקריאה מלאה
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* התראות */}
      <section>
        <h2 style={{ marginBottom: 12 }}>Notifications</h2>
        {uniqueNotifs.length === 0 ? (
          <div>אין התראות כרגע.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 12,
            }}
          >
            {uniqueNotifs.map((n: any) => {
              const mainTopic: string =
                (n.topics_hint && n.topics_hint[0]) || 'Other';
              const meta = TOPIC_META[mainTopic] ?? TOPIC_META.Other;

              return (
                <article
                  key={n.id}
                  style={{
                    borderRadius: 10,
                    padding: 12,
                    background: '#fafafa',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <span>{n.title}</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 12,
                        background: meta.bg,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {meta.emoji} {meta.label}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
