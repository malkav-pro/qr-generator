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
 * Dot style types from @liquid-js/qr-code-styling library
 * Includes 22 built-in styles
 */
export type DotType =
  // Basic styles
  | 'square' | 'dot' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
  // Geometric shapes
  | 'diamond' | 'heart' | 'star' | 'pentagon' | 'hexagon'
  // Minimal/Modern
  | 'small-square' | 'tiny-square'
  // Line patterns
  | 'vertical-line' | 'horizontal-line'
  // Organic/Pattern styles
  | 'random-dot' | 'wave' | 'weave' | 'zebra-horizontal' | 'zebra-vertical'
  | 'blocks-horizontal' | 'blocks-vertical';

/**
 * Corner square style types from @liquid-js/qr-code-styling library
 * Library accepts DotType union per cornersSquareOptions.type definition
 */
export type CornerSquareType =
  // Library's CornerSquareType enum
  | 'square' | 'dot' | 'extra-rounded' | 'classy'
  | 'inpoint' | 'outpoint' | 'center-circle'
  // DotType values also work (union type in library)
  | DotType;

/**
 * Corner dot style types from @liquid-js/qr-code-styling library
 * Library accepts DotType union per cornersDotOptions.type definition
 */
/**
 * QR code shape type from @liquid-js/qr-code-styling library
 */
export type ShapeType = 'square' | 'circle';

export type CornerDotType =
  // Library's CornerDotType enum
  | 'square' | 'dot' | 'extra-rounded' | 'classy'
  | 'heart' | 'star' | 'pentagon' | 'hexagon' | 'diamond'
  | 'inpoint' | 'outpoint'
  // DotType values also work (union type in library)
  | DotType;

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
  // Shape
  shape?: ShapeType;                      // Overall QR shape (default: 'square')
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
