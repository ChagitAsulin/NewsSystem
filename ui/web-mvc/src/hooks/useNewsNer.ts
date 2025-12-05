// ui/web-mvc/src/hooks/useNewsNer.ts
import { useEffect, useState } from "react";
import { analyzeText, NerEntity } from "../services_access/nerService";
import { News } from "../models/News"; // להתאים לשם המודל שלך

export function useNewsNer(news?: News | null) {
  const [entities, setEntities] = useState<NerEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!news?.content) {
      setEntities([]);
      return;
    }

    setLoading(true);
    analyzeText(news.content)
      .then((ents) => setEntities(ents))
      .catch((err) => {
        console.error("NER failed", err);
        setEntities([]);
      })
      .finally(() => setLoading(false));
  }, [news?.content]);

  return { entities, loading };
}

