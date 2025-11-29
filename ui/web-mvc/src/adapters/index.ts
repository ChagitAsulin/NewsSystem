//export * from './newsMapper'; export * from './notificationMapper';

/*
מטרה:
מספק נקודת ייבוא ​​אחת לכל המתאמים, 
כך שחלקים אחרים של האפליקציה יכולים לייבא רק מתאמים במקום מקבצים בודדים.
 שומר על ייבוא ​​נקי ומאורגן.
*/

/// <summary>
/// Centralized adapter export file
/// Provides a single entry point to all mappers in the adapters folder.
/// This improves imports in frontend code, making them clean and maintainable.
/// Example usage:
/// import { mapNewsItem, mapNotification } from "../adapters";
/// </summary>

export * from "./newsMapper";
export * from "./notificationMapper";
