/**
 * Query Cache Persister
 * Persists the TanStack Query cache to IndexedDB via idb-keyval.
 * On app reload, cached data is restored instantly — no network needed.
 */

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

/**
 * IndexedDB-backed storage adapter using localStorage as fallback.
 * We use localStorage here because createSyncStoragePersister requires
 * synchronous storage. For most school apps, the cache size is well
 * within localStorage limits (~5MB).
 *
 * If cache size becomes an issue, switch to createAsyncStoragePersister
 * with idb-keyval for true IndexedDB persistence.
 */
export const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'sanchalan-query-cache',
    // Throttle writes to avoid excessive IO
    throttleTime: 1000,
});
