'use client';

import { useState, useCallback } from 'react';

interface ShareButtonProps {
  className?: string;
}

/**
 * ShareButton - Copy current URL (including config hash) to clipboard
 *
 * Provides user feedback for successful copy and error states.
 * Uses Clipboard API which requires HTTPS or localhost.
 *
 * States:
 * - Default: "Share URL" (blue button)
 * - Copied: "Copied!" (green, 2s duration)
 * - Error: Error message (red, 3s duration)
 *
 * @example
 * <ShareButton className="mt-4" />
 */
export function ShareButton({ className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      // Get current URL (includes hash)
      const url = window.location.href;

      // Use Clipboard API (requires HTTPS or localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for insecure contexts (should be rare)
        setError('Clipboard access requires HTTPS');
      }
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setError('Failed to copy URL');
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      className={`w-full h-11 px-4 py-2 rounded-lg font-medium transition-all duration-150 shadow-sm
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        active:scale-95 disabled:active:scale-100
        motion-reduce:transition-none motion-reduce:active:scale-100 ${
        copied
          ? 'bg-green-600 text-white cursor-default focus-visible:ring-green-600'
          : error
            ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600'
            : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white focus-visible:ring-[var(--color-primary)]'
      } ${className}`}
    >
      {copied ? 'Copied!' : error ? error : 'Share URL'}
    </button>
  );
}
