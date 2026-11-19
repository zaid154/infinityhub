import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Scroll Restoration for React Router SPA
 * Ensures every route change instantly resets window scroll to the top (0, 0),
 * prevents browser auto-scroll to footer, and handles async re-renders.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // 1. Disable browser's auto scroll restoration on SPA navigation
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // If there is an anchor hash (e.g. #rental-calculator), handle smoothly
    if (hash) {
      const elem = document.querySelector(hash);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const resetScroll = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // 1. Instant synchronous reset
    resetScroll();

    // 2. Next animation frame (after React commit phase)
    const rafId = requestAnimationFrame(resetScroll);

    // 3. Delayed safety check (handles async data loading / DOM height expansion)
    const timerId = setTimeout(resetScroll, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname, search, hash]);

  return null;
}
