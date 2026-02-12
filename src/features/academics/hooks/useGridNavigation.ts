import { useEffect } from 'react';

/**
 * Hook for Excel-like keyboard navigation in the marks grid
 * Supports Enter, ArrowUp, ArrowDown
 */
export const useGridNavigation = (containerRef: React.RefObject<HTMLTableElement | null>) => {
  useEffect(() => {
    const table = containerRef.current;
    if (!table) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if an input is focused
      const activeElement = document.activeElement as HTMLInputElement;
      if (!activeElement || activeElement.tagName !== 'INPUT' || !table.contains(activeElement)) {
        return;
      }

      if (['Enter', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault(); // Prevent scrolling or default form submission

        const inputs = Array.from(table.querySelectorAll('input:not([disabled])')) as HTMLInputElement[];
        const currentIndex = inputs.indexOf(activeElement);

        if (currentIndex === -1) return;

        let nextIndex = currentIndex;

        if (e.key === 'Enter' || e.key === 'ArrowDown') {
          nextIndex = Math.min(currentIndex + 1, inputs.length - 1);
        } else if (e.key === 'ArrowUp') {
          nextIndex = Math.max(currentIndex - 1, 0);
        }

        if (nextIndex !== currentIndex) {
            inputs[nextIndex].focus();
            // Optional: Select text when focusing
            // inputs[nextIndex].select(); 
        }
      }
    };

    // Use capture to handle it before local handlers if needed, 
    // but here bubble phase on table is fine.
    table.addEventListener('keydown', handleKeyDown);

    return () => {
      table.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef]);
};
