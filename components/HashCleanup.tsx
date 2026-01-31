'use client';

import { useEffect } from 'react';

/**
 * HashCleanup - Remove URL hash on page load
 *
 * Strips any hash fragments from old shareable URLs to prevent confusion.
 * This ensures users always see a clean URL when the page loads.
 */
export function HashCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If hash exists, strip it from the URL
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  return null; // No UI needed
}
