import QRCodeStyling from 'qr-code-styling';
import type { QRConfig } from '@/lib/types/qr-config';
import { isGradient } from '@/lib/types/gradient';

/**
 * Creates a QRCodeStyling instance with the given configuration.
 *
 * Uses Error Correction Level H (30% recovery capacity) for maximum resilience
 * against damage and logo overlays. Includes ISO 18004 compliant 4-module quiet zone.
 *
 * Supports advanced styling:
 * - Gradient or solid foreground colors
 * - All dot style options (square, dots, rounded, classy, classy-rounded, extra-rounded)
 * - Corner square and corner dot styles
 * - Logo overlay with hideBackgroundDots
 *
 * @param config - QR code configuration (data, colors, scale, styles, logo)
 * @returns QRCodeStyling instance
 */
export function createQRCode(config: QRConfig): QRCodeStyling {
  const size = (config.scale || 10) * 25; // Approximate size based on scale

  // Determine dot color/gradient
  const dotsColor = config.foregroundGradient && isGradient(config.foregroundGradient)
    ? undefined
    : config.foreground;

  const dotsGradient = config.foregroundGradient && isGradient(config.foregroundGradient)
    ? config.foregroundGradient
    : undefined;

  // Build image options if logo is provided
  const imageOptions = config.logo ? {
    hideBackgroundDots: config.logo.hideBackgroundDots,
    imageSize: config.logo.size,
    margin: config.logo.margin,
  } : undefined;

  return new QRCodeStyling({
    width: size,
    height: size,
    data: config.data || '',
    margin: 4 * (config.scale || 10), // TECH-02: 4-module quiet zone scaled
    qrOptions: {
      errorCorrectionLevel: 'H', // TECH-01: Always use highest error correction (30% recovery)
    },
    dotsOptions: {
      color: dotsColor,
      gradient: dotsGradient,
      type: config.dotsStyle || 'square',
    },
    backgroundOptions: {
      color: config.background === 'transparent' ? 'transparent' : config.background,
    },
    cornersSquareOptions: {
      color: dotsColor,
      gradient: dotsGradient,
      type: config.cornersSquareStyle || 'square',
    },
    cornersDotOptions: {
      color: dotsColor,
      gradient: dotsGradient,
      type: config.cornersDotStyle || 'square',
    },
    image: config.logo?.image,
    imageOptions,
  });
}

/**
 * Generates a QR code and renders it to a canvas element.
 *
 * @param canvas - HTML canvas element to render the QR code to
 * @param config - QR code configuration (data, colors, scale)
 * @throws Error if QR generation fails or data is invalid
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
    const qrCode = createQRCode(config);
    const rawData = await qrCode.getRawData('png');

    if (!rawData) {
      throw new Error('Failed to generate QR code blob');
    }

    // In browser environment, rawData is a Blob
    const blob = rawData as Blob;

    // Load the blob as an image and draw to canvas
    const img = new Image();
    const url = URL.createObjectURL(blob);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load QR code image'));
      };
      img.src = url;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code: ${message}`);
  }
}

/**
 * Generates a QR code and returns it as a data URL (base64-encoded PNG).
 *
 * @param config - QR code configuration (data, colors, scale)
 * @param width - Optional width in pixels for the generated image
 * @returns Promise resolving to data URL string (data:image/png;base64,...)
 * @throws Error if QR generation fails or data is invalid
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
    const size = width || (config.scale || 10) * 25;

    // Use createQRCode for consistent styling with advanced options
    const configWithSize = { ...config, scale: Math.round(size / 25) };
    const qrCode = createQRCode(configWithSize);

    const rawData = await qrCode.getRawData('png');
    if (!rawData) {
      throw new Error('Failed to generate QR code blob');
    }

    // In browser environment, rawData is a Blob
    const blob = rawData as Blob;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code data URL: ${message}`);
  }
}
