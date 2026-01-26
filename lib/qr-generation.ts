import QRCode from 'qrcode';
import type { QRConfig } from '@/lib/types/qr-config';

/**
 * Generates a QR code and renders it to a canvas element.
 *
 * Uses Error Correction Level H (30% recovery capacity) for maximum resilience
 * against damage and logo overlays. Includes ISO 18004 compliant 4-module quiet zone.
 *
 * @param canvas - HTML canvas element to render the QR code to
 * @param config - QR code configuration (data, colors, scale)
 * @throws Error if QR generation fails or data is invalid
 *
 * @example
 * const canvas = canvasRef.current;
 * await generateQRCode(canvas, {
 *   type: 'url',
 *   data: 'https://example.com',
 *   foreground: '#000000',
 *   background: '#ffffff',
 *   errorCorrectionLevel: 'H',
 *   scale: 10
 * });
 */
export async function generateQRCode(
  canvas: HTMLCanvasElement,
  config: QRConfig
): Promise<void> {
  // Handle empty data gracefully - clear canvas
  if (!config.data || config.data.trim() === '') {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  try {
    await QRCode.toCanvas(canvas, config.data, {
      errorCorrectionLevel: 'H',  // TECH-01: Always use highest error correction (30% recovery)
      margin: 4,                   // TECH-02: ISO 18004 compliant 4-module quiet zone
      color: {
        dark: config.foreground,   // Foreground color for dark modules
        light: config.background   // Background color for light modules
      },
      scale: config.scale || 10    // Module size multiplier (default 10)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code: ${message}`);
  }
}

/**
 * Generates a QR code and returns it as a data URL (base64-encoded PNG).
 *
 * Uses Error Correction Level H (30% recovery capacity) for maximum resilience.
 * Includes ISO 18004 compliant 4-module quiet zone.
 *
 * Useful for exporting QR codes as images or displaying in <img> tags.
 *
 * @param config - QR code configuration (data, colors, scale)
 * @param width - Optional width in pixels for the generated image
 * @returns Promise resolving to data URL string (data:image/png;base64,...)
 * @throws Error if QR generation fails or data is invalid
 *
 * @example
 * const dataUrl = await generateQRDataURL({
 *   type: 'url',
 *   data: 'https://example.com',
 *   foreground: '#000000',
 *   background: '#ffffff',
 *   errorCorrectionLevel: 'H',
 *   scale: 10
 * }, 1000);
 *
 * // Use in <img> tag
 * <img src={dataUrl} alt="QR Code" />
 */
export async function generateQRDataURL(
  config: QRConfig,
  width?: number
): Promise<string> {
  // Handle empty data gracefully
  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot generate QR code data URL: data is empty');
  }

  try {
    const options: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',  // TECH-01: Always use highest error correction (30% recovery)
      margin: 4,                   // TECH-02: ISO 18004 compliant 4-module quiet zone
      color: {
        dark: config.foreground,   // Foreground color for dark modules
        light: config.background   // Background color for light modules
      },
      scale: config.scale || 10    // Module size multiplier (default 10)
    };

    // Add width if specified
    if (width) {
      options.width = width;
    }

    return await QRCode.toDataURL(config.data, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code data URL: ${message}`);
  }
}
