import React from 'react';

interface QRPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isGenerating?: boolean;
  error?: string | null;
}

export function QRPreview({
  canvasRef,
  isGenerating = false,
  error = null,
}: QRPreviewProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg">
      {/* Loading indicator */}
      {isGenerating && (
        <div className="mb-3 text-[var(--color-primary)] flex items-center justify-center gap-2">
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
          <span className="text-sm font-medium">Generating...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Canvas element - fills width */}
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg border border-[var(--color-border)]"
        style={{ aspectRatio: '1/1' }}
      />
    </div>
  );
}
