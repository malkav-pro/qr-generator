'use client';

import { useState } from 'react';
import { exportPNG, downloadPNG } from '@/lib/png-export';

interface ExportButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  disabled?: boolean;
  filename?: string;
}

const DPI_OPTIONS = [
  { value: 150, label: '150 DPI (Web)', pixels: '300x300px' },
  { value: 300, label: '300 DPI (Print)', pixels: '600x600px' },
  { value: 600, label: '600 DPI (High-res)', pixels: '1200x1200px' },
] as const;

export function ExportButton({
  canvasRef,
  disabled = false,
  filename = 'qrcode.png',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDpi, setSelectedDpi] = useState<number>(300);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('No QR code to export');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const blob = await exportPNG(canvas, {
        dpi: selectedDpi,
        widthInches: 2,
        heightInches: 2,
        filename,
      });

      downloadPNG(blob, filename);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed';
      setError(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Export Settings</label>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* DPI Selector */}
        <select
          value={selectedDpi}
          onChange={(e) => setSelectedDpi(Number(e.target.value))}
          disabled={disabled || isExporting}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="Select export quality"
        >
          {DPI_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.pixels}
            </option>
          ))}
        </select>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={disabled || isExporting}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-h-11"
          aria-label="Export QR code as PNG"
        >
          {isExporting ? (
            <>
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
              Exporting...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export PNG
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Info text */}
      <p className="text-xs text-gray-500">
        Exports at 2&quot; x 2&quot; ({selectedDpi * 2}x{selectedDpi * 2} pixels)
      </p>
    </div>
  );
}
