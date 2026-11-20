import { useState, useEffect } from 'react';

/**
 * Accessibility hook respecting OS-level reduced motion preferences
 */
export function useReducedMotionSafe() {
  const [shouldReduce, setShouldReduce] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  ));

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e) => setShouldReduce(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return shouldReduce;
}
