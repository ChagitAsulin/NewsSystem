//export const log=(...a:any[])=>console.log(...a);

/*
תפקיד: אחיד לכל פרויקט – מאפשר רישום צבעוני של הודעות, 
כולל debug למצב פיתוח, info/warn/error עם timestamps ISO 8601, תומך בניטור ובעיות בזמן אמת.
*/

/**
 * @file logger.ts
 * @description Centralized logging utility for both Node.js and browser.
 * Supports info, warn, error, debug levels with timestamps and project colors.
 * Automatically detects environment and applies appropriate coloring.
 */

import { DateUtils } from "./dates";

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

// צבעי פרויקט
const COLORS = {
  INFO: "cyan",       // תכלת
  WARN: "orange",     // כתום/אפרסק
  ERROR: "red",       // אדום/ורוד
  DEBUG: "purple",    // סגול
};

class Logger {
  private static isBrowser = typeof window !== "undefined";

  private static format(level: LogLevel, message: string): [string, string?] {
    const timestamp = DateUtils.toISO8601(new Date());
    const fullMessage = `[${timestamp}] [${level}] ${message}`;

    if (Logger.isBrowser) {
      // בדפדפן: מחזירים %c עם CSS
      const color = COLORS[level] || "black";
      return [`%c${fullMessage}`, `color: ${color}; font-weight: bold;`];
    } else {
      // Node.js: קונסול צבעוני עם ANSI codes
      let colorStart = "";
      const colorEnd = "\x1b[0m";
      switch (level) {
        case "INFO": colorStart = "\x1b[36m"; break; // תכלת
        case "WARN": colorStart = "\x1b[33m"; break; // כתום/צהוב
        case "ERROR": colorStart = "\x1b[31m"; break; // אדום
        case "DEBUG": colorStart = "\x1b[35m"; break; // סגול
      }
      return [`${colorStart}${fullMessage}${colorEnd}`];
    }
  }

  static info(message: string) {
    const args = Logger.format("INFO", message);
    Logger.isBrowser ? console.log(...args) : console.log(...args);
  }

  static warn(message: string) {
    const args = Logger.format("WARN", message);
    Logger.isBrowser ? console.warn(...args) : console.warn(...args);
  }

  static error(message: string) {
    const args = Logger.format("ERROR", message);
    Logger.isBrowser ? console.error(...args) : console.error(...args);
  }

  static debug(message: string) {
    if (process.env.NODE_ENV !== "production") {
      const args = Logger.format("DEBUG", message);
      Logger.isBrowser ? console.debug(...args) : console.debug(...args);
    }
  }
}

export default Logger;
