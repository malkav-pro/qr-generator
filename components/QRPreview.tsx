import React from 'react';
import type { ShapeType } from '@/lib/types/qr-config';

interface QRPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isGenerating?: boolean;
  error?: string | null;
  backgroundImage?: string | null;
  backgroundOpacity?: number;
  shape?: ShapeType;
}

export function QRPreview({
  containerRef,
  isGenerating = false,
  error = null,
  backgroundImage = null,
  backgroundOpacity = 1.0,
  shape = 'square',
}: QRPreviewProps) {
  return (
    <div className="flex flex-col rounded-lg">
      {/* Loading indicator */}
      {isGenerating && (
        <div className="mb-4 text-[var(--accent-start)] flex items-center justify-center gap-2.5 py-2 px-4 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border-medium)]">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-sm font-semibold tracking-tight">Generating...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      {/* QR Code container with background image layering */}
      <div
        className={`relative overflow-hidden border-2 border-[var(--border-medium)] bg-[var(--surface-elevated)] transition-all duration-300 hover:border-[var(--border-strong)] aspect-square ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Background image layer - z-index: 0 */}
        {backgroundImage && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: backgroundOpacity,
              zIndex: 0
            }}
          />
        )}

        {/* QR canvas layer - z-index: 1 */}
        <div
          ref={containerRef}
          className="relative z-10 w-full h-full flex items-center justify-center"
        />
      </div>
    </div>
  );
}
