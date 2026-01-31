import { QRCodeStyling } from '@liquid-js/qr-code-styling';
import type { QRConfig } from '@/lib/types/qr-config';
import { isGradient } from '@/lib/types/gradient';

/**
 * SVG Export Utilities for QR Codes
 *
 * Produces vector SVG output with no white gaps.
 * qr-code-styling automatically merges paths for clean SVG rendering.
 */

export interface SVGExportOptions {
  /** Background image data URL to embed in SVG */
  backgroundImage?: string;
  /** Background image opacity (0-1, default: 1) */
  backgroundOpacity?: number;
  /** QR code shape for clipping background */
  shape?: 'square' | 'circle';
}

/**
 * Creates a QRCodeStyling instance configured for SVG output
 * Uses same styling options as PNG generation for consistency
 *
 * @param config - QR code configuration
 * @returns QRCodeStyling instance configured for SVG
 */
function createSVGQRCode(config: QRConfig): QRCodeStyling {
  const size = 1024;

  // Determine dot color/gradient
  const dotsColor = config.foregroundGradient && isGradient(config.foregroundGradient)
    ? undefined
    : config.foreground;

  const dotsGradient = config.foregroundGradient && isGradient(config.foregroundGradient)
    ? config.foregroundGradient
    : undefined;

  const logo = config.logo && typeof config.logo === 'object' ? config.logo : undefined;

  const baseOptions = {
    width: size,
    height: size,
    data: config.data || '',
    shape: config.shape || 'square' as const,
    qrOptions: {
      typeNumber: 0 as const,
      errorCorrectionLevel: 'H' as const,
    },
    dotsOptions: {
      size: 10,
      color: dotsColor,
      gradient: dotsGradient,
      type: config.dotsStyle || 'square',
    },
    backgroundOptions: {
      color: config.background === 'transparent' ? 'transparent' : config.background,
      margin: 4,
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
          imageOptions: {
            mode: 'center' as const,
            fill: {
              color: 'rgba(255,255,255,0.75)',
            },
            imageSize: logo.size ?? 0.4,
            margin: logo.margin ?? 0,
          },
        }
      : {}),
  });
}

/**
 * Generates QR code as SVG blob
 *
 * @param config - QR code configuration
 * @param options - SVG export options (background image, opacity, shape)
 * @returns Promise resolving to SVG blob
 * @throws Error if QR generation fails or data is invalid
 */
export async function getQRCodeSVGBlob(config: QRConfig, options?: SVGExportOptions): Promise<Blob> {
  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot generate QR code SVG: data is empty');
  }

  try {
    const qrCode = createSVGQRCode(config);
    let svgString = await qrCode.serialize();

    if (!svgString) {
      throw new Error('Failed to generate QR code SVG string');
    }

    // If background image provided, embed it in the SVG
    if (options?.backgroundImage) {
      const { backgroundImage, backgroundOpacity = 1.0, shape = 'square' } = options;

      // Insert background image element after the opening <svg> tag
      // Find the end of the opening <svg> tag
      const svgTagEnd = svgString.indexOf('>');
      if (svgTagEnd === -1) {
        throw new Error('Invalid SVG string: no opening tag found');
      }

      let backgroundImageElement = '';

      // Add clip path for circle shape
      if (shape === 'circle') {
        const clipPathDef = '<defs><clipPath id="bg-clip"><circle cx="512" cy="512" r="512"/></clipPath></defs>';
        backgroundImageElement = `${clipPathDef}<image href="${backgroundImage}" x="0" y="0" width="1024" height="1024" opacity="${backgroundOpacity}" clip-path="url(#bg-clip)" />`;
      } else {
        backgroundImageElement = `<image href="${backgroundImage}" x="0" y="0" width="1024" height="1024" opacity="${backgroundOpacity}" />`;
      }

      // Insert background image right after opening svg tag
      svgString = svgString.slice(0, svgTagEnd + 1) + backgroundImageElement + svgString.slice(svgTagEnd + 1);
    }

    return new Blob([svgString], { type: 'image/svg+xml' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate QR code SVG blob: ${message}`);
  }
}

/**
 * Generates QR code as SVG data URL
 *
 * @param config - QR code configuration
 * @param options - SVG export options (background image, opacity, shape)
 * @returns Promise resolving to data URL string (data:image/svg+xml;base64,...)
 * @throws Error if QR generation fails or data is invalid
 */
export async function getQRCodeSVGDataURL(config: QRConfig, options?: SVGExportOptions): Promise<string> {
  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot generate QR code SVG data URL: data is empty');
  }

  try {
    const blob = await getQRCodeSVGBlob(config, options);

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
 * @param options - SVG export options (background image, opacity, shape)
 * @throws Error if QR generation fails or data is invalid
 */
export async function exportQRCodeSVG(
  config: QRConfig,
  filename = 'qrcode.svg',
  options?: SVGExportOptions
): Promise<void> {
  if (!config.data || config.data.trim() === '') {
    throw new Error('Cannot export QR code SVG: data is empty');
  }

  try {
    const blob = await getQRCodeSVGBlob(config, options);
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
