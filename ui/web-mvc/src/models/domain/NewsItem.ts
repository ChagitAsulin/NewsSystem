export type Entity = {
  type: 'person' | 'location' | 'org' | 'misc';
  value: string;
  salience?: number;
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;          // נבנה מ-mediaClient (לא חובה עכשיו)
  topics: string[];           // לדוגמה ["science"]
  classification: string;     // תוצאת zero-shot
  tags: string[];             // תגיות כלליות
  entities: Entity[];         // ישויות מ-NER
  createdAt: Date;            // תאריך יצירה כ-Date
};

