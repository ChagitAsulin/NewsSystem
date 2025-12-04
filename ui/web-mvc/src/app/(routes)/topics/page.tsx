//export default function Topics(){ return <div>Topics page</div> }

"use client";
import { useEffect, useState } from "react";

interface Topic {
  id: string;
  name: string;
}

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000'}/topics`);
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data: Topic[] = await res.json();
        setTopics(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{padding:16}}>Loading…</div>;
  if (error) return <div style={{padding:16}}>Failed to load topics</div>;
  if (!topics.length) return <div style={{padding:16}}>No topics yet</div>;

  return (
    <div style={{padding:16, display:"grid", gap:12}}>
      {topics.map(t => (
        <div key={t.id} style={{border:"1px solid #ddd", borderRadius:8, padding:12}}>
          {t.name}
        </div>
      ))}
    </div>
  );
}
