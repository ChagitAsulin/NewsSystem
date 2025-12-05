// ui/web-mvc/src/services_access/nerService.ts
// נניח שיש לך client כללי ל-API; אם לא – נשתמש ב-fetch רגיל.

export type NerEntity = {
  text: string;
  label?: string;
  score?: number;
  start?: number;
  end?: number;
};

export async function analyzeText(text: string): Promise<NerEntity[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ner`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    console.error("NER request failed", await res.text());
    return [];
  }

  const data = await res.json();
  return data.entities ?? [];
}
