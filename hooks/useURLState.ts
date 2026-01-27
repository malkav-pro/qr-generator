import { useEffect, useRef } from 'react';
import {
  decodeConfig,
  type ShareableConfig,
} from '@/lib/url-state';

/**
 * URL state restoration hook
 *
 * Manages URL hash restoration only:
 * - On mount: restores config from URL hash if present
 * - On hashchange: restores config from URL (browser back/forward)
 *
 * Note: URL is NOT automatically updated when config changes. This prevents
 * URL pollution when user opens page with default settings. The ShareButton
 * component handles URL generation when user explicitly wants to share.
 *
 * @param onRestore - Callback when config should be restored from URL
 *
 * @example
 * const handleRestore = useCallback((restored: ShareableConfig) => {
 *   const fullConfig = fromShareableConfig(restored, config.logo);
 *   setConfig(fullConfig);
 * }, [config.logo]);
 *
 * useURLState(handleRestore);
 */
export function useURLState(
  onRestore: (config: ShareableConfig) => void
): void {
  const isInitialMount = useRef(true);
  const isProgrammaticUpdate = useRef(false);

  // On mount: check for hash and restore
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.slice(1);
    if (hash && isInitialMount.current) {
      const restored = decodeConfig(hash);
      if (restored) {
        onRestore(restored);
      }
    }
    isInitialMount.current = false;
  }, [onRestore]);

  // Listen for external hash changes (back/forward navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      // Ignore programmatic updates
      if (isProgrammaticUpdate.current) return;

      const hash = window.location.hash.slice(1);
      if (hash) {
        const restored = decodeConfig(hash);
        if (restored) {
          onRestore(restored);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onRestore]);
}
