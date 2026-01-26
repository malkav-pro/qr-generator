/**
 * Barrel export for QR code type definitions
 */

// Gradient types
export type {
  GradientType,
  GradientColorStop,
  Gradient,
  ColorValue,
} from './gradient';

export {
  isGradient,
  isSolidColor,
} from './gradient';

// QR configuration types
export type {
  QRType,
  EmailData,
  DotType,
  CornerSquareType,
  CornerDotType,
  LogoConfig,
  QRConfig,
  ExportConfig,
} from './qr-config';
