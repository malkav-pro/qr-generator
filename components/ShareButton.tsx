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
      className={`w-full h-12 px-5 py-2.5 rounded-xl font-semibold tracking-tight transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
        active:scale-[0.98] disabled:active:scale-100
        ${
        copied
          ? 'bg-green-500 text-[var(--background)] cursor-default focus-visible:ring-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
          : error
            ? 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            : 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-medium)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)] focus-visible:ring-[var(--accent-start)]'
      } ${className}`}
    >
      {copied ? '✓ Copied!' : error ? error : 'Share URL'}
    </button>
  );
}
