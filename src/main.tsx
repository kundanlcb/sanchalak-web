/**
 * Application Entry Point
 * Initializes providers: Theme, Auth, QueryClient, and React strict mode
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './utils/i18n/i18nConfig'; // Initialize i18n
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './features/auth/services/authContext';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from './lib/queryClient';
import { persister } from './lib/persister';

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK_API !== 'true') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
        onSuccess={() => {
          // Resume any mutations that were paused while offline
          queryClient.resumePausedMutations();
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </StrictMode>,
  );
});


