//export const queryClient=null;

/*
תפקיד הקובץ:
queryClient.ts מספק אובייקט QueryClient גלובלי עבור כל האפליקציה, 
מה שמאפשר לכל רכיבי ה־UI להשתמש ב־React Query כדי לשלוף נתונים בצורה אסינכרונית, 
קלה למעקב, עם קאשינג אוטומטי וריטריים חכמים. 
רכיבי אחרים, כמו הפיד של חדשות (DashboardView) או רכיבי החדשות עצמם, 
לא צריכים לנהל בקשות בעצמם – הם רק צורכים את הנתונים מה־QueryClient.
*/

// src/state/queryClient.ts
import { QueryClient, DefaultOptions } from "@tanstack/react-query";

/**
 * Global QueryClient configuration for the NewsSystem project.
 *
 * The QueryClient manages caching, retries, refetching, and error handling
 * across all components that fetch data via React Query.
 *
 * Default options:
 * - staleTime: duration (ms) before data is considered stale
 * - refetchOnWindowFocus: whether to refetch when window gains focus
 * - retry: number of retry attempts for failed requests
 * - retryDelay: exponential backoff formula for retries
 *
 * Note: cacheTime should be set per-query if needed.
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Data is fresh for 1 minute before being considered stale
    staleTime: 1000 * 60,

    // Do not refetch when window regains focus
    refetchOnWindowFocus: false,

    // Retry failed requests up to 2 times
    retry: 2,

    // Exponential backoff for retries: 2^attemptIndex * 1000ms, capped at 30s
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on mount if data is stale
    refetchOnMount: true,
  },
};

/**
 * The QueryClient instance used throughout the application.
 *
 * All components using React Query hooks (useQuery, useMutation, etc.)
 * should use this client to ensure consistent caching and retry behavior.
 */
export const queryClient = new QueryClient({ defaultOptions });
