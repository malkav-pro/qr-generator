/**
 * Gradient type definitions for QR code styling
 * Compatible with qr-code-styling library gradient format
 */

export type GradientType = 'linear' | 'radial';

export interface GradientColorStop {
  offset: number;  // 0-1 range
  color: string;   // Hex color with alpha support (e.g., '#FF0000FF')
}

export interface Gradient {
  type: GradientType;
  rotation?: number;           // Rotation in radians (for linear gradients)
  colorStops: GradientColorStop[];
}

/**
 * Union type allowing both solid colors and gradients
 */
export type ColorValue = string | Gradient;

/**
 * Type guard to check if a ColorValue is a Gradient
 */
export function isGradient(value: ColorValue): value is Gradient {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'colorStops' in value &&
    (value.type === 'linear' || value.type === 'radial')
  );
}

/**
 * Type guard to check if a ColorValue is a solid color string
 */
export function isSolidColor(value: ColorValue): value is string {
  return typeof value === 'string';
}
