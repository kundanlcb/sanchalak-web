/**
 * Mutation Toast Hook — Sanchalan
 * Subscribes to TanStack Query's MutationCache to show user feedback
 * on offline/online mutation state transitions.
 *
 * Usage: Call `useMutationToast()` once in your App component.
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type ToastType = 'info' | 'success' | 'error';


/**
 * Creates a minimal DOM toast notification.
 * Keeps things self-contained — no 3rd-party toast library needed.
 */
function showToast(type: ToastType, message: string, duration = 3000) {
    const container = getOrCreateContainer();
    const toast = document.createElement('div');
    toast.className = `mutation-toast mutation-toast--${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    // Trigger entrance animation
    requestAnimationFrame(() => toast.classList.add('mutation-toast--visible'));

    setTimeout(() => {
        toast.classList.remove('mutation-toast--visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

function getOrCreateContainer(): HTMLElement {
    let container = document.getElementById('mutation-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mutation-toast-container';
        container.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    `;
        document.body.appendChild(container);

        // Inject styles once
        const style = document.createElement('style');
        style.textContent = `
      .mutation-toast {
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: white;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 360px;
      }
      .mutation-toast--visible {
        opacity: 1;
        transform: translateX(0);
      }
      .mutation-toast--info {
        background: #3b82f6;
      }
      .mutation-toast--success {
        background: #10b981;
      }
      .mutation-toast--error {
        background: #ef4444;
      }
    `;
        document.head.appendChild(style);
    }
    return container;
}

/**
 * Hook: Subscribes to MutationCache events and shows feedback toasts.
 * Call once in your root App component.
 */
export function useMutationToast() {
    const queryClient = useQueryClient();
    const shownRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        const cache = queryClient.getMutationCache();
        const unsubscribe = cache.subscribe((event) => {
            const mutation = event.mutation;
            if (!mutation) return;

            const id = String(mutation.mutationId);
            const state = mutation.state;

            // Only show toasts for mutations that have a mutationKey (our tracked ones)
            const key = mutation.options.mutationKey;
            if (!key || key.length === 0) return;

            const label = String(key[key.length - 1] ?? 'Changes');

            if (state.isPaused && !shownRef.current.has(`paused-${id}`)) {
                shownRef.current.add(`paused-${id}`);
                showToast('info', `${label} saved locally — will sync when online`);
            }

            if (state.status === 'success' && !shownRef.current.has(`success-${id}`)) {
                shownRef.current.add(`success-${id}`);
                // Only show sync toast if it was previously paused (offline → online)
                if (shownRef.current.has(`paused-${id}`)) {
                    showToast('success', `${label} synced ✓`);
                }
            }

            if (state.status === 'error' && !shownRef.current.has(`error-${id}`)) {
                shownRef.current.add(`error-${id}`);
                showToast('error', `${label} failed — please retry`);
            }
        });

        return () => unsubscribe();
    }, [queryClient]);
}
