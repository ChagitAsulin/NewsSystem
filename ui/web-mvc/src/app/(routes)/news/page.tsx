"use client";
import { useEffect, useState } from "react";
import { NewsRepository } from "@/repositories/NewsRepository";
import type { NewsItem } from "@/models/domain/NewsItem";

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await NewsRepository.getLatest(["science","culture"], 50);
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{padding:16}}>Loading…</div>;
  if (!items.length) return <div style={{padding:16}}>No news yet</div>;

  return (
    <div style={{padding:16, display:"grid", gap:12}}>
      {items.map(n => (
        <div key={n.id} style={{border:"1px solid #ddd", borderRadius:8, padding:12}}>
          <div style={{fontWeight:700}}>{n.title}</div>
          <div style={{opacity:.8}}>{n.summary}</div>
          <div style={{fontSize:12, marginTop:6}}>
            topics: {n.topics?.join(", ")} | class: {n.classification}
          </div>
        </div>
      ))}
    </div>
  );
}
