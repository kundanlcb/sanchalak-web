/**
 * Network Status Banner
 * Shows a persistent banner when the user is offline or on a slow connection.
 */

import React from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const bannerStyles: Record<string, React.CSSProperties> = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
    },
    offline: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
        borderBottom: '1px solid #FECACA',
    },
    slow: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        borderBottom: '1px solid #FDE68A',
    },
    hidden: {
        transform: 'translateY(-100%)',
        opacity: 0,
        pointerEvents: 'none' as const,
    },
};

export const NetworkStatusBanner: React.FC = () => {
    const { isOnline, isSlowConnection } = useNetworkStatus();

    const showBanner = !isOnline || isSlowConnection;
    const isOffline = !isOnline;

    const style: React.CSSProperties = {
        ...bannerStyles.container,
        ...(isOffline ? bannerStyles.offline : bannerStyles.slow),
        ...(showBanner ? {} : bannerStyles.hidden),
    };

    return (
        <div style={style} role="alert" aria-live="polite">
            {isOffline ? (
                <>
                    <span>📡</span>
                    <span>You're offline — showing cached data</span>
                </>
            ) : isSlowConnection ? (
                <>
                    <span>🐢</span>
                    <span>Slow connection detected — data may take longer to load</span>
                </>
            ) : null}
        </div>
    );
};
