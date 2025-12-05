// ui/web-mvc/src/app/page.tsx
'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';

const API = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
const fetcher = (url: string) => fetch(url).then(r => r.json());

// Topic → badge meta
const TOPIC_META: Record<string, { label: string; emoji: string; bg: string }> = {
  World: { label: 'World', emoji: '🌍', bg: '#e3f2fd' },
  Politics: { label: 'Politics', emoji: '🏛️', bg: '#f3e5f5' },
  Sports: { label: 'Sports', emoji: '🏅', bg: '#e8f5e9' },
  Tech: { label: 'Tech', emoji: '💻', bg: '#e0f2f1' },
  Business: { label: 'Business', emoji: '💼', bg: '#fff3e0' },
  Other: { label: 'Other', emoji: '📰', bg: '#eeeeee' },
};

export default function DashboardPage() {
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

  if (newsErr || notifsErr) return <div>Error loading data.</div>;
  if (newsLoading || notifsLoading) return <div>Loading…</div>;

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '32px 24px 48px',
        background: '#f3f4f6',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, system-ui, "SF Pro Text", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <header
          style={{
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 0.3,
              color: '#111827',
            }}
          >
            News Intelligence Dashboard
          </h1>
          <p
            style={{
              margin: 0,
              color: '#6b7280',
              fontSize: 14,
            }}
          >
            Live stream of enriched news and system notifications.
          </p>
        </header>

        {/* Filters */}
        <section
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              fontSize: 14,
              color: '#374151',
            }}
          >
            <span style={{ fontWeight: 500 }}>Filter by topic:</span>
            <select
              value={topicFilter}
              onChange={e => setTopicFilter(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid #d1d5db',
                fontSize: 13,
                background: '#f9fafb',
                outline: 'none',
              }}
            >
              <option value="all">All topics</option>
              {allTopics.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <span
            style={{
              fontSize: 12,
              color: '#9ca3af',
            }}
          >
            Showing {filteredNews.length} articles
          </span>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2.2fr) minmax(0, 1fr)',
            gap: 24,
            alignItems: 'flex-start',
          }}
        >
          {/* News */}
          <section>
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 18,
                fontWeight: 600,
                color: '#111827',
              }}
            >
              News stream
            </h2>

            {filteredNews.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: '#ffffff',
                  border: '1px dashed #d1d5db',
                  fontSize: 14,
                  color: '#6b7280',
                }}
              >
                No articles match the current filter.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                      ? contentText.slice(0, 160) +
                        (contentText.length > 160 ? '…' : '')
                      : 'No summary available.';

                  return (
                    <article
                      key={n.id}
                      style={{
                        borderRadius: 12,
                        padding: 12,
                        background: '#ffffff',
                        boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {/* Cloudinary image */}
                      {n.image_url && (
                        <div
                          style={{
                            overflow: 'hidden',
                            borderRadius: 10,
                            maxHeight: 160,
                          }}
                        >
                          <img
                            src={n.image_url}
                            alt={n.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 8,
                          alignItems: 'flex-start',
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 15,
                            lineHeight: 1.35,
                            color: '#111827',
                            fontWeight: 600,
                          }}
                        >
                          {n.title}
                        </h3>

                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 999,
                            fontSize: 11,
                            background: meta.bg,
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {meta.emoji} {meta.label}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: '#4b5563',
                        }}
                      >
                        {snippet}
                      </p>

                      <div
                        style={{
                          marginTop: 4,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: 11,
                          color: '#9ca3af',
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
                            style={{
                              textDecoration: 'none',
                              fontWeight: 500,
                              color: '#2563eb',
                            }}
                          >
                            Open full article →
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Notifications */}
          <section>
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 18,
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Notifications
            </h2>
            {uniqueNotifs.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: '#ffffff',
                  border: '1px dashed #d1d5db',
                  fontSize: 14,
                  color: '#6b7280',
                }}
              >
                No notifications at the moment.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
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
                        padding: 10,
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: '#111827',
                          }}
                        >
                          {n.title}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 999,
                            fontSize: 11,
                            background: meta.bg,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {meta.emoji} {meta.label}
                        </span>
                      </div>
                      {n.created_at && (
                        <span
                          style={{
                            fontSize: 11,
                            color: '#9ca3af',
                          }}
                        >
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
