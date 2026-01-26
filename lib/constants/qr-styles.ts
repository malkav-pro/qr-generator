import type { DotType, CornerSquareType, CornerDotType } from '../types';

/**
 * Available dot style options with display labels
 */
export const DOT_STYLES: Array<{ value: DotType; label: string }> = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

/**
 * Available corner square style options with display labels
 */
export const CORNER_SQUARE_STYLES: Array<{ value: CornerSquareType; label: string }> = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

/**
 * Available corner dot style options with display labels
 */
export const CORNER_DOT_STYLES: Array<{ value: CornerDotType; label: string }> = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
];
