import QRCodeStyling from 'qr-code-styling';
import type { QRConfig } from '@/lib/types/qr-config';
import { isGradient } from '@/lib/types/gradient';

/**
 * SVG Export Utilities for QR Codes
 *
 * Produces vector SVG output with no white gaps.
 * qr-code-styling automatically merges paths for clean SVG rendering.
 */

/**
 * Creates a QRCodeStyling instance configured for SVG output
 * Uses same styling options as PNG generation for consistency
 *
 * @param config - QR code configuration
 * @returns QRCodeStyling instance configured for SVG
 */
function createSVGQRCode(config: QRConfig): QRCodeStyling {
  const size = (config.scale || 10) * 25;

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
    type: 'svg',
    width: size,
    height: size,
    data: config.data || '',
    margin: 4 * (config.scale || 10),
    qrOptions: {
      errorCorrectionLevel: 'H',
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
 * Generates QR code as SVG blob
 *
 * @param config - QR code configuration
 * @returns Promise resolving to SVG blob
 * @throws Error if QR generation fails or data is invalid
 */
export async function getQRCodeSVGBlob(config: QRConfig): Promise<Blob> {
  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot generate QR code SVG: data is empty');
  }

  try {
    const qrCode = createSVGQRCode(config);
    const rawData = await qrCode.getRawData('svg');

    if (!rawData) {
      throw new Error('Failed to generate QR code SVG blob');
    }

    return rawData as Blob;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code SVG blob: ${message}`);
  }
}

/**
 * Generates QR code as SVG data URL
 *
 * @param config - QR code configuration
 * @returns Promise resolving to data URL string (data:image/svg+xml;base64,...)
 * @throws Error if QR generation fails or data is invalid
 */
export async function getQRCodeSVGDataURL(config: QRConfig): Promise<string> {
  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot generate QR code SVG data URL: data is empty');
  }

  try {
    const blob = await getQRCodeSVGBlob(config);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to convert SVG blob to data URL'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code SVG data URL: ${message}`);
  }
}

/**
 * Exports QR code as downloadable SVG file
 *
 * @param config - QR code configuration
 * @param filename - Filename for download (default: 'qrcode.svg')
 * @throws Error if QR generation fails or data is invalid
 */
export async function exportQRCodeSVG(
  config: QRConfig,
  filename = 'qrcode.svg'
): Promise<void> {
  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot export QR code SVG: data is empty');
  }

  try {
    const blob = await getQRCodeSVGBlob(config);
    const url = URL.createObjectURL(blob);

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL
    URL.revokeObjectURL(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export QR code SVG: ${message}`);
  }
}
