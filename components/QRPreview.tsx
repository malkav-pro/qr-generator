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
    <div className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-lg bg-white">
      {/* Loading indicator */}
      {isGenerating && (
        <div className="mb-4 text-blue-600 flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
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
          <span className="text-sm font-medium">Generating QR code...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-md text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Canvas element */}
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto border border-gray-200 rounded-md shadow-sm"
        style={{ minWidth: '256px', minHeight: '256px' }}
      />

      {/* Helper text */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        QR code updates automatically as you type
      </p>
    </div>
  );
}
