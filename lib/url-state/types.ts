import type {
  QRType,
  QRConfig,
  DotType,
  CornerSquareType,
  CornerDotType,
  LogoConfig,
} from '@/lib/types/qr-config';
import type { Gradient } from '@/lib/types/gradient';

/**
 * ShareableConfig - QR configuration without logo field
 *
 * Logos are excluded from URL sharing because data URLs are too large
 * for URL encoding (typically 10KB+ for even small logos).
 *
 * This maintains reasonable URL lengths (< 2000 characters) while
 * sharing all other configuration options.
 */
export interface ShareableConfig {
  type: QRType;
  data: string;
  foreground: string;
  background: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  scale: number;
  // Advanced styling options
  foregroundGradient?: Gradient;
  dotsStyle?: DotType;
  cornersSquareStyle?: CornerSquareType;
  cornersDotStyle?: CornerDotType;
  cornersSquareColor?: string;
  cornersDotColor?: string;
  // Note: logo field intentionally excluded
}

/**
 * Convert full QRConfig to ShareableConfig by stripping logo
 *
 * @param config - Full QR configuration
 * @returns ShareableConfig without logo field
 */
export function toShareableConfig(config: QRConfig): ShareableConfig {
  const { logo, ...shareable } = config;
  return shareable;
}

/**
 * Convert ShareableConfig back to QRConfig
 *
 * @param shareable - Configuration from URL
 * @param existingLogo - Optional logo to preserve from current state
 * @returns Full QRConfig with optional logo restored
 */
export function fromShareableConfig(
  shareable: ShareableConfig,
  existingLogo?: LogoConfig
): QRConfig {
  return {
    ...shareable,
    logo: existingLogo,
  };
}
