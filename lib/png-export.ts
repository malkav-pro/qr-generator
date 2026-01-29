/**
 * PNG Export Module
 *
 * Provides functionality to export QR codes as high-resolution PNG files
 * suitable for print applications.
 *
 * Note: Canvas toDataURL does not embed DPI metadata in PNG files.
 * Print quality is achieved through raw pixel count:
 * - 600x600 pixels = 300 DPI at 2 inches
 * - Image viewers may show 72/96 DPI but print size will be correct
 */

import type { QRConfig } from '@/lib/types/qr-config';
import { createQRCodeWithSize } from '@/lib/qr-generation';
import { browserUtils } from '@liquid-js/qr-code-styling';

export interface ExportOptions {
  /** Target DPI for export (default: 300) */
  dpi?: number;
  /** Target width in inches (default: 2) */
  widthInches?: number;
  /** Target height in inches (default: 2) */
  heightInches?: number;
  /** Filename for download (default: 'qrcode.png') */
  filename?: string;
}

export interface QRExportOptions {
  /** Target size in pixels (default: 1024) */
  sizePx?: number;
  /** Filename for download (default: 'qrcode.png') */
  filename?: string;
}

/**
 * Export a canvas element as a high-resolution PNG blob.
 *
 * Scales the source canvas to target dimensions based on DPI and inches.
 * Uses nearest-neighbor interpolation (imageSmoothingEnabled = false) for
 * crisp QR code pixels.
 *
 * @param sourceCanvas - The canvas element containing the QR code
 * @param options - Export options (DPI, dimensions, filename)
 * @returns Promise resolving to PNG Blob
 *
 * @example
 * const blob = await exportPNG(canvasRef.current, { dpi: 300 });
 * // blob is 600x600 pixels (300 DPI * 2 inches)
 */
export async function exportPNG(
  sourceCanvas: HTMLCanvasElement,
  options?: ExportOptions
): Promise<Blob> {
  const {
    dpi = 300,
    widthInches = 2,
    heightInches = 2,
  } = options || {};

  // Calculate target pixel dimensions
  const targetWidth = Math.round(dpi * widthInches);
  const targetHeight = Math.round(dpi * heightInches);

  // Create temporary high-res canvas
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetWidth;
  exportCanvas.height = targetHeight;

  const ctx = exportCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context for export');
  }

  // Disable image smoothing for crisp pixel scaling
  // This preserves sharp edges on QR code modules
  ctx.imageSmoothingEnabled = false;

  // Draw source canvas scaled up to target size
  ctx.drawImage(
    sourceCanvas,
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Convert to PNG blob
  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG blob'));
        }
      },
      'image/png',
      1.0 // Maximum quality
    );
  });
}

/**
 * Export a QR code directly from configuration as a high-resolution PNG blob.
 *
 * Avoids canvas scaling artifacts by rendering at the target size.
 */
export async function exportQRCodePNG(
  config: QRConfig,
  options?: QRExportOptions
): Promise<Blob> {
  const { sizePx = 1024 } = options || {};

  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot export QR code PNG: data is empty');
  }

  try {
    const qrCode = createQRCodeWithSize(config, sizePx);

    if (!browserUtils) {
      throw new Error('Browser utils not available');
    }

    const result = browserUtils.drawToCanvas(qrCode, { width: sizePx, height: sizePx });

    if (!result) {
      throw new Error('Failed to generate QR code canvas');
    }

    const { canvas, canvasDrawingPromise } = result;

    // Wait for drawing to complete
    if (canvasDrawingPromise) {
      await canvasDrawingPromise;
    }

    // Convert canvas to PNG blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate QR code PNG blob'));
          }
        },
        'image/png',
        1.0 // Maximum quality
      );
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export QR code PNG: ${message}`);
  }
}

/**
 * Trigger a download of a PNG blob.
 *
 * Creates a temporary anchor element, triggers the download, and cleans up.
 *
 * @param blob - The PNG blob to download
 * @param filename - The filename for the download
 *
 * @example
 * const blob = await exportPNG(canvas, { dpi: 300 });
 * downloadPNG(blob, 'my-qrcode.png');
 */
export function downloadPNG(blob: Blob, filename: string): void {
  // Create object URL from blob
  const url = URL.createObjectURL(blob);

  // Create temporary anchor element
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;

  // Trigger download
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
