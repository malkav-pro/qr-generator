import { ColorValue, Gradient } from './gradient';
import { QRTypeKey } from '@/lib/formatters';

// QRType derived from formatters module (single source of truth)
export type QRType = QRTypeKey;

/**
 * @deprecated Use EmailData from lib/formatters/email instead
 * Kept for backward compatibility during Phase 5 migration
 */
export interface EmailData {
  to: string;
  subject?: string;
  body?: string;
}

/**
 * Dot style types from qr-code-styling library
 */
export type DotType = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';

/**
 * Corner square style types - includes all DotType options plus 'dot'
 */
export type CornerSquareType = 'dot' | DotType;

/**
 * Corner dot style types - includes all DotType options plus 'dot'
 */
export type CornerDotType = 'dot' | DotType;

/**
 * Logo configuration for QR code overlay
 */
export interface LogoConfig {
  image: string;              // Data URL of logo image
  size: number;               // 0-0.25, percentage of QR code size
  margin: number;             // Margin around logo in pixels
  hideBackgroundDots: boolean; // Whether to hide dots behind logo
}

export interface QRConfig {
  type: QRType;
  data: string;           // The actual content (URL, text, or formatted mailto)
  foreground: string;     // Hex color for dark modules
  background: string;     // Hex color for light modules
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  scale: number;          // Module size multiplier
  // Advanced styling options
  foregroundGradient?: Gradient;         // Alternative to solid foreground color
  dotsStyle?: DotType;                   // Dot appearance style (default: 'square')
  cornersSquareStyle?: CornerSquareType; // Corner square style (default: 'square')
  cornersDotStyle?: CornerDotType;       // Corner dot style (default: 'square')
  cornersSquareColor?: string;           // Solid color for corner squares
  cornersDotColor?: string;              // Solid color for corner dots
  logo?: LogoConfig;                     // Optional logo overlay
}

export interface ExportConfig {
  dpi: number;
  width: number;          // Target width in inches
  height: number;         // Target height in inches
}
