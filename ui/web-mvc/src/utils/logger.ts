//export const log=(...a:any[])=>console.log(...a);

/*
תפקיד: אחיד לכל פרויקט – מאפשר רישום צבעוני של הודעות, 
כולל debug למצב פיתוח, info/warn/error עם timestamps ISO 8601, תומך בניטור ובעיות בזמן אמת.
*/

/**
 * @file logger.ts
 * @description Centralized logging utility for consistent and elegant console/log outputs.
 * Supports info, warning, error, and debug levels with timestamps and color formatting.
 */

import { DateUtils } from "./dates";

/**
 * Logging levels
 */
type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

class Logger {
  private static format(level: LogLevel, message: string) {
    const timestamp = DateUtils.toISO8601(new Date());
    let colorStart = "";
    const colorEnd = "\x1b[0m";

    switch (level) {
      case "INFO":
        colorStart = "\x1b[34m"; // blue
        break;
      case "WARN":
        colorStart = "\x1b[33m"; // yellow
        break;
      case "ERROR":
        colorStart = "\x1b[31m"; // red
        break;
      case "DEBUG":
        colorStart = "\x1b[36m"; // cyan
        break;
    }

    return `${colorStart}[${timestamp}] [${level}] ${message}${colorEnd}`;
  }

  static info(message: string) {
    console.log(Logger.format("INFO", message));
  }

  static warn(message: string) {
    console.warn(Logger.format("WARN", message));
  }

  static error(message: string) {
    console.error(Logger.format("ERROR", message));
  }

  static debug(message: string) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(Logger.format("DEBUG", message));
    }
  }
}

export default Logger;
