//export const env={ api: process.env.NEXT_PUBLIC_API_BASE_URL };

/*
תפקיד: מספק גישה מאוחדת ובטוחה ל־ENV, כולל בדיקה מוקדמת למניעת בעיות בהפעלה.
*/

/**
 * @file env.ts
 * @description Centralized access to environment variables.
 * Ensures type safety and consistent use of ENV across frontend and backend services.
 */

interface EnvConfig {
  KAFKA_BROKERS: string;
  KAFKA_USERNAME?: string;
  KAFKA_PASSWORD?: string;
  NEWSAPI_KEY: string;
  CLOUDINARY_CLOUD: string;
  CLOUDINARY_KEY: string;
  CLOUDINARY_SECRET: string;
  GATEWAY_URL: string;
  UI_PUBLIC_API_URL: string;
}

const rawEnv: Partial<EnvConfig> = {
  KAFKA_BROKERS: process.env.NEXT_PUBLIC_KAFKA_BROKERS,
  KAFKA_USERNAME: process.env.NEXT_PUBLIC_KAFKA_USERNAME,
  KAFKA_PASSWORD: process.env.NEXT_PUBLIC_KAFKA_PASSWORD,
  NEWSAPI_KEY: process.env.NEXT_PUBLIC_NEWSAPI_KEY,
  CLOUDINARY_CLOUD: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  CLOUDINARY_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET,
  GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
  UI_PUBLIC_API_URL: process.env.NEXT_PUBLIC_UI_PUBLIC_API_URL,
};

/**
 * Validates that all required environment variables are set.
 * Throws error if a required variable is missing.
 */
function validateEnv(env: Partial<EnvConfig>): EnvConfig {
  const missing = Object.entries(env).filter(
    ([key, value]) =>
      value === undefined && key !== "KAFKA_USERNAME" && key !== "KAFKA_PASSWORD"
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing
        .map(([key]) => key)
        .join(", ")}`
    );
  }
  return env as EnvConfig;
}

export const ENV = validateEnv(rawEnv);
