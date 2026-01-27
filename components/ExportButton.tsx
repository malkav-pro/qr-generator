'use client';

import { useMemo, useState } from 'react';
import { exportQRCodePNG, downloadPNG } from '@/lib/png-export';
import { exportQRCodeSVG } from '@/lib/svg-export';
import type { QRConfig } from '@/lib/types/qr-config';
import { Button } from '@/components/ui';

interface ExportButtonProps {
  qrConfig: QRConfig;
  disabled?: boolean;
  filename?: string;
}

const DPI_OPTIONS = [
  { value: 150, label: '150 DPI (Web)', pixels: '300x300px' },
  { value: 300, label: '300 DPI (Print)', pixels: '600x600px' },
  { value: 512, label: '512 DPI (QR.io)', pixels: '1024x1024px' },
  { value: 600, label: '600 DPI (High-res)', pixels: '1200x1200px' },
] as const;

export function ExportButton({
  qrConfig,
  disabled = false,
  filename = 'qrcode.png',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDpi, setSelectedDpi] = useState<number>(512);
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [error, setError] = useState<string | null>(null);

  const exportFilename = useMemo(() => {
    const trimmed = filename.trim() || 'qrcode';
    if (format === 'svg') {
      if (trimmed.toLowerCase().endsWith('.svg')) {
        return trimmed;
      }
      return trimmed.toLowerCase().endsWith('.png')
        ? trimmed.replace(/\.png$/i, '.svg')
        : `${trimmed}.svg`;
    }

    if (trimmed.toLowerCase().endsWith('.png')) {
      return trimmed;
    }

    return `${trimmed}.png`;
  }, [filename, format]);

  const handleExport = async () => {
    if (format === 'png' && (!qrConfig.data || qrConfig.data.trim() === '')) {
      setError('No QR code to export');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      if (format === 'png') {
        const sizePx = Math.round(selectedDpi * 2);
        const blob = await exportQRCodePNG(qrConfig, { sizePx, filename: exportFilename });

        downloadPNG(blob, exportFilename);
      } else {
        await exportQRCodeSVG(qrConfig, exportFilename);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed';
      setError(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-[var(--surface-base)] rounded-lg border border-[var(--border-medium)]">
          <Button
            type="button"
            onClick={() => setFormat('png')}
            disabled={disabled || isExporting}
            variant={format === 'png' ? 'secondary' : 'ghost'}
            size="sm"
          >
            PNG
          </Button>
          <Button
            type="button"
            onClick={() => setFormat('svg')}
            disabled={disabled || isExporting}
            variant={format === 'svg' ? 'secondary' : 'ghost'}
            size="sm"
          >
            SVG
          </Button>
        </div>

        {format === 'png' && (
          <select
            value={selectedDpi}
            onChange={(e) => setSelectedDpi(Number(e.target.value))}
            disabled={disabled || isExporting}
            className="px-3.5 py-2.5 h-11 text-sm border rounded-lg font-medium
              transition-all duration-200
              focus:outline-none
              disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Select export quality"
          >
            {DPI_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} DPI
              </option>
            ))}
          </select>
        )}
      </div>

      <Button
        onClick={handleExport}
        disabled={disabled || isExporting}
        loading={isExporting}
        variant="primary"
        size="md"
        className="w-full h-12"
        aria-label={`Export QR code as ${format.toUpperCase()}`}
      >
        {!isExporting && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
        Export {format.toUpperCase()}
      </Button>

      {error && (
        <p className="text-sm text-red-400 font-medium" role="alert">
          {error}
        </p>
      )}

      {format === 'png' && (
        <p className="text-xs text-[var(--text-muted)] font-medium">
          {selectedDpi * 2}x{selectedDpi * 2}px at 2&quot; x 2&quot;
        </p>
      )}
    </div>
  );
}
