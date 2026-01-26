import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import type { QRConfig } from '@/lib/types/qr-config';
import {
  encodeConfig,
  decodeConfig,
  toShareableConfig,
  type ShareableConfig,
} from '@/lib/url-state';

interface UseURLStateOptions {
  delay?: number; // Debounce delay for hash updates (default: 500ms)
}

interface UseURLStateReturn {
  // Called to restore config from URL on mount
  restoreFromURL: () => ShareableConfig | null;
}

/**
 * Bidirectional URL state synchronization hook
 *
 * Manages automatic synchronization between QR config state and URL hash:
 * - On mount: restores config from URL hash if present
 * - On config change: updates URL hash (debounced, 500ms default)
 * - On hashchange: restores config from URL (browser back/forward)
 *
 * Uses history.replaceState to avoid polluting browser history with
 * intermediate states as user adjusts controls.
 *
 * @param config - Current QR configuration state
 * @param onRestore - Callback when config should be restored from URL
 * @param options - Configuration options (debounce delay)
 * @returns Object with restoreFromURL method
 *
 * @example
 * const [config, setConfig] = useState(defaultConfig);
 *
 * const handleRestore = useCallback((restored: ShareableConfig) => {
 *   const fullConfig = fromShareableConfig(restored, config.logo);
 *   setConfig(fullConfig);
 * }, [config.logo]);
 *
 * useURLState(config, handleRestore, { delay: 500 });
 */
export function useURLState(
  config: QRConfig,
  onRestore: (config: ShareableConfig) => void,
  options: UseURLStateOptions = {}
): UseURLStateReturn {
  const { delay = 500 } = options;
  const isInitialMount = useRef(true);
  const isProgrammaticUpdate = useRef(false);

  // Debounce config changes (500ms, longer than UI's 300ms)
  const debouncedConfig = useDebounce(config, delay);

  // Restore from URL - called on mount
  const restoreFromURL = useCallback((): ShareableConfig | null => {
    if (typeof window === 'undefined') return null;

    const hash = window.location.hash.slice(1); // Remove '#'
    if (!hash) return null;

    const restored = decodeConfig(hash);
    return restored;
  }, []);

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

  // On config change: update URL hash (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitialMount.current) return;

    const shareable = toShareableConfig(debouncedConfig);
    const encoded = encodeConfig(shareable);

    // Use replaceState to avoid polluting browser history
    // and to avoid triggering hashchange event
    isProgrammaticUpdate.current = true;
    history.replaceState(null, '', `#${encoded}`);
    isProgrammaticUpdate.current = false;
  }, [debouncedConfig]);

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

  return { restoreFromURL };
}
