import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import { generateQRCode } from '@/lib/qr-generation';
import type { QRConfig } from '@/lib/types/qr-config';

/**
 * Result object returned by useQRCode hook
 */
export interface UseQRCodeResult {
  /** Ref to attach to container element for QR rendering */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** True while QR code is being generated */
  isGenerating: boolean;
  /** Error message if generation failed, null otherwise */
  error: string | null;
}

/**
 * React hook for debounced QR code generation.
 *
 * Automatically generates QR codes to a container element when config changes.
 * Uses direct canvas rendering for crisp, artifact-free display.
 * Debounces updates to prevent excessive regeneration during rapid changes.
 *
 * @param config - QR code configuration (data, colors, scale, etc.)
 * @param debounceMs - Debounce delay in milliseconds (default: 300ms)
 * @param displaySize - Target display size in pixels (optional)
 * @returns Object with containerRef, isGenerating state, and error state
 */
export function useQRCode(
  config: QRConfig,
  debounceMs: number = 300,
  displaySize?: number
): UseQRCodeResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Debounce the entire config object to prevent excessive regeneration
  const debouncedConfig = useDebounce(
    JSON.stringify(config),
    debounceMs
  );

  // Debounce display size changes too
  const debouncedSize = useDebounce(displaySize, debounceMs);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Parse debounced config back to object
    const parsedConfig: QRConfig = JSON.parse(debouncedConfig);

    // Handle empty data gracefully
    if (!parsedConfig.data || parsedConfig.data.trim() === '') {
      // Clear container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      setError(null);
      setIsGenerating(false);
      return;
    }

    // Generate QR code
    const generate = async () => {
      if (!isMountedRef.current) return;

      setIsGenerating(true);
      setError(null);

      try {
        await generateQRCode(container, parsedConfig, debouncedSize);

        if (isMountedRef.current) {
          setError(null);
        }
      } catch (err) {
        if (isMountedRef.current) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setError(message);
        }
      } finally {
        if (isMountedRef.current) {
          setIsGenerating(false);
        }
      }
    };

    generate();
  }, [debouncedConfig, debouncedSize]);

  return {
    containerRef,
    isGenerating,
    error
  };
}
