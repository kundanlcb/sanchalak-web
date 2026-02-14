/**
 * Network Status Hook
 * Reactive hook for detecting online/offline state and slow connections.
 */

import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
    isOnline: boolean;
    isSlowConnection: boolean;
    effectiveType: string | null; // '4g', '3g', '2g', 'slow-2g'
}

/**
 * Hook that tracks network connectivity and connection quality.
 * Uses Navigator.onLine + Network Information API (where available).
 */
export function useNetworkStatus(): NetworkStatus {
    const [status, setStatus] = useState<NetworkStatus>(() => ({
        isOnline: navigator.onLine,
        isSlowConnection: false,
        effectiveType: null,
    }));

    const updateConnectionInfo = useCallback(() => {
        const connection = (navigator as any).connection;
        if (connection) {
            const effectiveType = connection.effectiveType as string;
            setStatus(prev => ({
                ...prev,
                effectiveType,
                isSlowConnection: effectiveType === '2g' || effectiveType === 'slow-2g',
            }));
        }
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            setStatus(prev => ({ ...prev, isOnline: true }));
            updateConnectionInfo();
        };

        const handleOffline = () => {
            setStatus(prev => ({ ...prev, isOnline: false }));
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Network Information API (Chrome-based browsers)
        const connection = (navigator as any).connection;
        if (connection) {
            updateConnectionInfo();
            connection.addEventListener('change', updateConnectionInfo);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (connection) {
                connection.removeEventListener('change', updateConnectionInfo);
            }
        };
    }, [updateConnectionInfo]);

    return status;
}
