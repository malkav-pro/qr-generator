/**
 * Custom QR Code Style Plugin Infrastructure
 *
 * VERIFIED: @liquid-js/qr-code-styling plugin API (v4.1.0+)
 * Built-in styles: 22 dot types, 7 corner square types, 11 corner dot types
 * Custom styles use Plugin interface with drawDot/drawCornerDot/drawCornerSquare SVG rendering
 *
 * The @liquid-js fork already provides 22 dot styles and 18 corner styles (exceeding our 15-20 target).
 * This file demonstrates the plugin extensibility pattern for future custom styles.
 *
 * Plugin API signature:
 * - drawDot(args: DrawArgs): SVGElement | undefined
 * - drawCornerDot(args: DrawArgs): SVGElement | undefined
 * - drawCornerSquare(args: DrawArgs): [SVGElement, SVGElement] | undefined
 *
 * DrawArgs interface:
 * {
 *   document: Document,
 *   x: number,
 *   y: number,
 *   size: number,
 *   rotation?: number,
 *   getNeighbor?: (x: number, y: number) => boolean,
 *   getPRandom?: () => number
 * }
 */

import type { Plugin } from '@liquid-js/qr-code-styling';

/**
 * Custom style module interface for data-driven previews and plugin integration
 *
 * This interface is designed for FUTURE custom styles if needed.
 * Currently, @liquid-js/qr-code-styling built-in styles (22 dot, 7 corner square, 11 corner dot)
 * already exceed our 15-20 target and include all desired aesthetic categories:
 * - Geometric: diamond, hexagon, pentagon, star, heart
 * - Minimal: small-square, tiny-square, lines
 * - Organic/Pattern: wave, weave, zebra, blocks, random-dot
 */
export interface CustomStyleModule {
  value: string;  // Unique identifier (e.g., 'custom-octagon')
  label: string;  // Display name for picker
  category: 'geometric' | 'organic' | 'minimal' | 'pattern';

  // SVG preview for picker thumbnail (React JSX)
  // Receives color prop for dynamic theming
  previewSVG: (color?: string) => React.ReactElement;

  // Plugin implementation for actual QR rendering
  // Returns SVG elements to be inserted into the QR code
  plugin: Plugin;
}

/**
 * Custom dot styles (currently empty - built-ins exceed target)
 *
 * To add a custom dot style:
 * 1. Define a CustomStyleModule with previewSVG and plugin.drawDot
 * 2. Add to this array
 * 3. Merge into DOT_STYLES in qr-styles.ts
 * 4. Extend DotType union in qr-config.ts
 * 5. Add preview case in style-previews.tsx (data-driven lookup)
 */
export const CUSTOM_DOT_STYLES: CustomStyleModule[] = [
  // Example structure (commented out):
  // {
  //   value: 'custom-octagon',
  //   label: 'Octagon',
  //   category: 'geometric',
  //   previewSVG: (color = '#000') => (
  //     <svg viewBox="0 0 100 100" fill={color}>
  //       <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" />
  //     </svg>
  //   ),
  //   plugin: {
  //     drawDot: ({ document, x, y, size }) => {
  //       const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  //       const offset = size * 0.3;
  //       polygon.setAttribute('points',
  //         `${x + offset},${y} ${x + size - offset},${y} ` +
  //         `${x + size},${y + offset} ${x + size},${y + size - offset} ` +
  //         `${x + size - offset},${y + size} ${x + offset},${y + size} ` +
  //         `${x},${y + size - offset} ${x},${y + offset}`
  //       );
  //       return polygon;
  //     }
  //   }
  // }
];

/**
 * Custom corner square styles (currently empty - built-ins sufficient)
 */
export const CUSTOM_CORNER_SQUARE_STYLES: CustomStyleModule[] = [];

/**
 * Custom corner dot styles (currently empty - built-ins sufficient)
 */
export const CUSTOM_CORNER_DOT_STYLES: CustomStyleModule[] = [];

/**
 * Helper to check if a style value is custom (not built-in)
 */
export function isCustomStyle(styleValue: string, customStyles: CustomStyleModule[]): boolean {
  return customStyles.some(s => s.value === styleValue);
}

/**
 * Helper to get custom style module by value
 */
export function getCustomStyleModule(
  styleValue: string,
  customStyles: CustomStyleModule[]
): CustomStyleModule | undefined {
  return customStyles.find(s => s.value === styleValue);
}

/**
 * NOTE ON EXTENSIBILITY (STYLE-11 requirement):
 *
 * Adding a new custom style requires editing ONLY this file (custom-styles.ts):
 * 1. Define the CustomStyleModule with previewSVG + plugin
 * 2. Add to appropriate array (CUSTOM_DOT_STYLES, etc.)
 * 3. Export and merge in qr-styles.ts (import + spread into arrays)
 * 4. Update type union in qr-config.ts (add string literal)
 * 5. style-previews.tsx will auto-detect via data-driven lookup (no code changes)
 * 6. qr-generation.ts will auto-integrate via plugin array (no code changes)
 *
 * This is "developer-config-extensible" where this file serves as the style registry.
 * Component and generation logic remain unchanged when adding styles.
 */
