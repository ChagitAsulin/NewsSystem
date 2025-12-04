//export type Topic = { code:string; name:string; subscribed:boolean };

/**
 * src/models/domain/Topic.ts
 *
 * Domain model for a selectable Topic in the UI.
 * Topics are the main filter unit for the news feed (Politics, Finance, etc).
 */

// models/domain/Topic.ts
export interface Topic {
  id: string;            // מזהה ייחודי
  code: string;          // קוד מה-API
  name: string;          // שם קריא למשתמש
  selected: boolean;     // האם הנושא נבחר ב-UI
  color?: string;        // צבע להצגה
  animate?: boolean;     // דגל אנימציה UI בלבד
  description?: string;  // תיאור אופציונלי
}
