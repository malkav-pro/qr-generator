import { QRCodeStyling, browserUtils } from '@liquid-js/qr-code-styling';
import type { QRConfig } from '@/lib/types/qr-config';
import { isGradient } from '@/lib/types/gradient';

/**
 * Builds QRCodeStyling options object from QRConfig.
 * Centralizes per-element gradient logic with proper precedence rules.
 *
 * Gradient precedence:
 * - Dots: dotsGradient > foregroundGradient > foreground (solid)
 * - Corner squares: cornersSquareGradient > cornersSquareColor > foreground
 * - Corner dots: cornersDotGradient > cornersDotColor > foreground
 * - Background: backgroundGradient > background (solid)
 *
 * @param config - QR code configuration
 * @param size - Pixel size for width/height
 * @returns Options object for QRCodeStyling constructor
 */
function buildStylingOptions(config: QRConfig, size: number) {
  // Dots gradient logic: dotsGradient > foregroundGradient > foreground (solid)
  const dotsGradient = (config.dotsGradient && isGradient(config.dotsGradient))
    ? config.dotsGradient
    : (config.foregroundGradient && isGradient(config.foregroundGradient))
      ? config.foregroundGradient
      : undefined;

  const dotsColor = dotsGradient ? undefined : config.foreground;

  // Corner squares gradient logic
  const cornersSquareGradient = (config.cornersSquareGradient && isGradient(config.cornersSquareGradient))
    ? config.cornersSquareGradient
    : undefined;

  const cornersSquareColor = cornersSquareGradient
    ? undefined
    : (config.cornersSquareColor || config.foreground);

  // Corner dots gradient logic
  const cornersDotGradient = (config.cornersDotGradient && isGradient(config.cornersDotGradient))
    ? config.cornersDotGradient
    : undefined;

  const cornersDotColor = cornersDotGradient
    ? undefined
    : (config.cornersDotColor || config.foreground);

  // Background gradient logic
  const backgroundGradient = (config.backgroundGradient && isGradient(config.backgroundGradient))
    ? config.backgroundGradient
    : undefined;

  const backgroundColor = backgroundGradient
    ? undefined
    : (config.background === 'transparent' ? 'transparent' : config.background);

  const logo = config.logo && typeof config.logo === 'object' ? config.logo : undefined;

  return {
    width: size,
    height: size,
    data: config.data || '',
    shape: config.shape || 'square' as const,
    qrOptions: {
      typeNumber: 0 as const, // Auto-detect
      errorCorrectionLevel: 'H' as const, // TECH-01: Always use highest error correction (30% recovery)
    },
    dotsOptions: {
      size: 10,
      color: dotsColor,
      gradient: dotsGradient,
      type: config.dotsStyle || 'square',
    },
    backgroundOptions: {
      color: backgroundColor,
      gradient: backgroundGradient,
      margin: 4, // TECH-02: 4-module quiet zone (in blocks, not pixels)
    },
    cornersSquareOptions: {
      color: cornersSquareColor,
      gradient: cornersSquareGradient,
      type: config.cornersSquareStyle || 'square',
    },
    cornersDotOptions: {
      color: cornersDotColor,
      gradient: cornersDotGradient,
      type: config.cornersDotStyle || 'square',
    },
    ...(logo
      ? {
          image: logo.image,
          imageOptions: {
            hideBackgroundDots: logo.hideBackgroundDots ?? true,
            imageSize: logo.size ?? 0.4,
            margin: logo.margin ?? 0,
          },
        }
      : {}),
  };
}

/**
 * Creates a QRCodeStyling instance with the given configuration.
 *
 * Uses Error Correction Level H (30% recovery capacity) for maximum resilience
 * against damage and logo overlays. Includes ISO 18004 compliant 4-module quiet zone.
 *
 * Supports advanced styling:
 * - Per-element gradients (dots, corner squares, corner dots, background)
 * - All dot style options (square, dots, rounded, classy, classy-rounded, extra-rounded)
 * - Corner square and corner dot styles
 * - Logo overlay with hideBackgroundDots
 *
 * @param config - QR code configuration (data, colors, scale, styles, logo)
 * @returns QRCodeStyling instance
 */
export function createQRCode(config: QRConfig): QRCodeStyling {
  const size = (config.scale || 10) * 25; // Approximate size based on scale
  return new QRCodeStyling(buildStylingOptions(config, size));
}

/**
 * Creates a QRCodeStyling instance with an explicit pixel size.
 *
 * Useful for high-quality exports where scaling a canvas would degrade edges.
 */
export function createQRCodeWithSize(
  config: QRConfig,
  sizePx: number
): QRCodeStyling {
  return new QRCodeStyling(buildStylingOptions(config, sizePx));
}

/**
 * Generates a QR code and renders it to a container element.
 * Uses direct append() for crisp rendering without PNG conversion artifacts.
 *
 * @param container - HTML element to render the QR code into
 * @param config - QR code configuration (data, colors, scale)
 * @param displaySize - Target display size in pixels
 * @throws Error if QR generation fails or data is invalid
 */
export async function generateQRCode(
  container: HTMLElement,
  config: QRConfig,
  displaySize?: number
): Promise<void> {
  // Clear existing content safely
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Handle empty data gracefully
  if (!config.data || config.data.trim() === '') {
    return;
  }

  try {
    // Generate at exactly the display size for crisp rendering
    const size = displaySize || (config.scale || 10) * 25;
    const qrCode = new QRCodeStyling(buildStylingOptions(config, size));

    // Render directly to container - no PNG conversion!
    await qrCode.append(container);
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

    // Use createQRCodeWithSize for consistent styling
    const qrCode = createQRCodeWithSize(config, size);

    // Draw to canvas using browser utils
    if (!browserUtils) {
      throw new Error('Browser utils not available');
    }

    const result = browserUtils.drawToCanvas(qrCode, { width: size, height: size });
    if (!result) {
      throw new Error('Failed to draw QR code to canvas');
    }

    const { canvas, canvasDrawingPromise } = result;

    // Wait for drawing to complete
    if (canvasDrawingPromise) {
      await canvasDrawingPromise;
    }

    // Convert canvas to data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code data URL: ${message}`);
  }
}
