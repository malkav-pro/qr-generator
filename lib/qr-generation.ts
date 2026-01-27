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

  const logo = config.logo && typeof config.logo === 'object' ? config.logo : undefined;

  // Build image options if logo is provided
  const imageOptions = logo ? {
    hideBackgroundDots: logo.hideBackgroundDots ?? true,
    imageSize: logo.size ?? 0.2,
    margin: logo.margin ?? 0,
  } : undefined;

  const baseOptions = {
    width: size,
    height: size,
    data: config.data || '',
    margin: 4 * (config.scale || 10), // TECH-02: 4-module quiet zone scaled
    qrOptions: {
      errorCorrectionLevel: 'H' as const, // TECH-01: Always use highest error correction (30% recovery)
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
      color: config.cornersSquareColor || config.foreground,
      type: config.cornersSquareStyle || 'square',
    },
    cornersDotOptions: {
      color: config.cornersDotColor || config.foreground,
      type: config.cornersDotStyle || 'square',
    },
  };

  return new QRCodeStyling({
    ...baseOptions,
    ...(logo
      ? {
          image: logo.image,
          imageOptions,
        }
      : {}),
  });
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
  const margin = Math.round((sizePx * 4) / 25);
  const dotsColor = config.foregroundGradient && isGradient(config.foregroundGradient)
    ? undefined
    : config.foreground;
  const dotsGradient = config.foregroundGradient && isGradient(config.foregroundGradient)
    ? config.foregroundGradient
    : undefined;
  const logo = config.logo && typeof config.logo === 'object' ? config.logo : undefined;
  const imageOptions = logo ? {
    hideBackgroundDots: logo.hideBackgroundDots ?? true,
    imageSize: logo.size ?? 0.2,
    margin: logo.margin ?? 0,
  } : undefined;

  return new QRCodeStyling({
    width: sizePx,
    height: sizePx,
    data: config.data || '',
    margin,
    qrOptions: {
      errorCorrectionLevel: 'H' as const,
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
      color: config.cornersSquareColor || config.foreground,
      type: config.cornersSquareStyle || 'square',
    },
    cornersDotOptions: {
      color: config.cornersDotColor || config.foreground,
      type: config.cornersDotStyle || 'square',
    },
    ...(logo
      ? {
          image: logo.image,
          imageOptions,
        }
      : {}),
  });
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

    const dotsColor = config.foregroundGradient && isGradient(config.foregroundGradient)
      ? undefined
      : config.foreground;
    const dotsGradient = config.foregroundGradient && isGradient(config.foregroundGradient)
      ? config.foregroundGradient
      : undefined;
    const logo = config.logo && typeof config.logo === 'object' ? config.logo : undefined;
    const imageOptions = logo ? {
      hideBackgroundDots: logo.hideBackgroundDots ?? true,
      imageSize: logo.size ?? 0.2,
      margin: logo.margin ?? 0,
    } : undefined;

    // Calculate margin proportionally
    const margin = Math.round((size * 4) / 25);

    const qrCode = new QRCodeStyling({
      type: 'canvas',
      width: size,
      height: size,
      data: config.data || '',
      margin,
      qrOptions: {
        errorCorrectionLevel: 'H' as const,
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
        color: config.cornersSquareColor || config.foreground,
        type: config.cornersSquareStyle || 'square',
      },
      cornersDotOptions: {
        color: config.cornersDotColor || config.foreground,
        type: config.cornersDotStyle || 'square',
      },
      ...(logo
        ? {
            image: logo.image,
            imageOptions,
          }
        : {}),
    });

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
