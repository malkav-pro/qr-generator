import type { DotType, CornerSquareType, CornerDotType } from '../types';

/**
 * Available dot style options with display labels
 * @liquid-js/qr-code-styling provides 22 built-in styles (original 6 + 16 new)
 */
export const DOT_STYLES: Array<{ value: DotType; label: string }> = [
  // Original styles (6)
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },

  // Geometric shapes (7)
  { value: 'diamond', label: 'Diamond' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'pentagon', label: 'Pentagon' },
  { value: 'hexagon', label: 'Hexagon' },

  // Minimal/Modern (3)
  { value: 'small-square', label: 'Small Square' },
  { value: 'tiny-square', label: 'Tiny Square' },

  // Line patterns (2)
  { value: 'vertical-line', label: 'Vertical Lines' },
  { value: 'horizontal-line', label: 'Horizontal Lines' },

  // Organic/Pattern styles (5)
  { value: 'random-dot', label: 'Random Dots' },
  { value: 'wave', label: 'Wave' },
  { value: 'weave', label: 'Weave' },
  { value: 'zebra-horizontal', label: 'Zebra Horizontal' },
  { value: 'zebra-vertical', label: 'Zebra Vertical' },
  { value: 'blocks-horizontal', label: 'Blocks Horizontal' },
  { value: 'blocks-vertical', label: 'Blocks Vertical' },
];

/**
 * Available corner square style options with display labels
 * @liquid-js/qr-code-styling provides 7 built-in styles
 */
export const CORNER_SQUARE_STYLES: Array<{ value: CornerSquareType; label: string }> = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'inpoint', label: 'Inpoint' },
  { value: 'outpoint', label: 'Outpoint' },
  { value: 'center-circle', label: 'Center Circle' },
];

/**
 * Available corner dot style options with display labels
 * @liquid-js/qr-code-styling provides 11 built-in styles
 */
export const CORNER_DOT_STYLES: Array<{ value: CornerDotType; label: string }> = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'pentagon', label: 'Pentagon' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'inpoint', label: 'Inpoint' },
  { value: 'outpoint', label: 'Outpoint' },
];
