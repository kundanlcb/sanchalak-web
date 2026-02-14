/**
 * Query Client Configuration
 * Central TanStack Query client with offline-first defaults.
 * All queries use stale-while-revalidate: show cached data instantly, sync in background.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes — no refetch during this window
            staleTime: 5 * 60 * 1000,

            // Keep cached data for 24 hours (even if unused)
            gcTime: 24 * 60 * 60 * 1000,

            // Retry failed requests with exponential backoff
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),

            // Refetch when user returns to the tab
            refetchOnWindowFocus: true,

            // Offline-first: attempt fetch, fall back to cache if offline
            networkMode: 'offlineFirst',

            // Don't refetch on mount if data is still fresh
            refetchOnMount: true,
        },
        mutations: {
            // Retry mutations up to 3 times
            retry: 3,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
            networkMode: 'offlineFirst',
        },
    },
});
