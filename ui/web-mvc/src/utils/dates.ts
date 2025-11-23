//export const fmt=(d:Date)=>d.toISOString();

/*
תפקיד: מספק פורמטים אחידים של תאריכים, 
שימוש ב-ISO 8601 ושיטות ל-relative time – חיוני ל-feed, notifications ולכל מקום שבו מוצגים תאריכים.
*/

/**
 * @file dates.ts
 * @description Utility functions for handling date and time operations in ISO 8601 format and localization.
 * Provides consistent date formatting and relative time calculations across the project.
 */

export class DateUtils {
  /**
   * Convert a date string or Date object to an ISO 8601 UTC string.
   * Ensures all dates stored or transmitted are in a standard format.
   * @param date Date object or ISO string
   * @returns ISO 8601 string in UTC
   */
  static toISO8601(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString();
  }

  /**
   * Format a date for display in the user's locale (Hebrew by default).
   * Uses Intl.DateTimeFormat for elegant, localized formatting.
   * @param date Date object or ISO string
   * @param locale Optional locale string (default: 'he-IL')
   * @param options Intl.DateTimeFormatOptions
   * @returns Formatted date string
   */
  static format(date: Date | string, locale: string = "he-IL", options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = { 
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
    };
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(d);
  }

  /**
   * Get relative time from a date to now (e.g., "2 hours ago").
   * Can be used for feeds and notifications.
   * @param date Date object or ISO string
   * @param locale Optional locale string
   * @returns Relative time string
   */
  static timeAgo(date: Date | string, locale: string = "en-US"): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const amount = Math.floor(seconds / value);
      if (amount >= 1) return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
    }

    return "just now";
  }
}
