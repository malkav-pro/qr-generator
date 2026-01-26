import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import { generateQRCode } from '@/lib/qr-generation';
import type { QRConfig } from '@/lib/types/qr-config';

/**
 * Result object returned by useQRCode hook
 */
export interface UseQRCodeResult {
  /** Ref to attach to canvas element for QR rendering */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** True while QR code is being generated */
  isGenerating: boolean;
  /** Error message if generation failed, null otherwise */
  error: string | null;
}

/**
 * React hook for debounced QR code generation.
 *
 * Automatically generates QR codes to a canvas element when config changes.
 * Debounces updates to prevent excessive regeneration during rapid changes
 * (e.g., while user is typing).
 *
 * @param config - QR code configuration (data, colors, scale, etc.)
 * @param debounceMs - Debounce delay in milliseconds (default: 300ms per PREVIEW-02)
 * @returns Object with canvasRef, isGenerating state, and error state
 *
 * @example
 * function QRPreview({ data }: { data: string }) {
 *   const { canvasRef, isGenerating, error } = useQRCode({
 *     type: 'url',
 *     data,
 *     foreground: '#000000',
 *     background: '#ffffff',
 *     errorCorrectionLevel: 'H',
 *     scale: 10
 *   });
 *
 *   return (
 *     <div>
 *       {isGenerating && <p>Generating...</p>}
 *       {error && <p className="text-red-500">{error}</p>}
 *       <canvas ref={canvasRef} />
 *     </div>
 *   );
 * }
 */
export function useQRCode(
  config: QRConfig,
  debounceMs: number = 300
): UseQRCodeResult {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Debounce the entire config object to prevent excessive regeneration
  // Use JSON serialization for deep comparison
  const debouncedConfig = useDebounce(
    JSON.stringify(config),
    debounceMs
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Parse debounced config back to object
    const parsedConfig: QRConfig = JSON.parse(debouncedConfig);

    // Handle empty data gracefully
    if (!parsedConfig.data || parsedConfig.data.trim() === '') {
      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        await generateQRCode(canvas, parsedConfig);

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
  }, [debouncedConfig]);

  return {
    canvasRef,
    isGenerating,
    error
  };
}
