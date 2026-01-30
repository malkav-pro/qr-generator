/**
 * Gradient CSS Parser Utility
 * Converts between CSS gradient strings and qr-code-styling Gradient format
 */

import { Gradient, GradientColorStop } from '../types/gradient';

/**
 * Check if a string is a CSS gradient
 */
export function isCSSGradient(value: string): boolean {
  return value.startsWith('linear-gradient') || value.startsWith('radial-gradient');
}

/**
 * Extract solid color from CSS gradient or hex string
 * If input is gradient, extracts first color stop
 * If input is hex, returns as-is
 */
export function extractSolidColor(cssOrHex: string): string {
  if (!isCSSGradient(cssOrHex)) {
    return cssOrHex;
  }

  const rgbaMatch = cssOrHex.match(/rgba?\([\d\s,]+\)/);
  if (rgbaMatch) {
    const rgba = rgbaMatch[0];
    const parts = rgba.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0]);
      const g = parseInt(parts[1]);
      const b = parseInt(parts[2]);
      const a = parts.length === 4 ? Math.round(parseFloat(parts[3]) * 255) : 255;
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${a.toString(16).padStart(2, '0')}`;
    }
  }

  const hexMatch = cssOrHex.match(/#[0-9a-fA-F]{6,8}/);
  if (hexMatch) {
    return hexMatch[0];
  }

  return '#000000';
}

export function parseGradientCSS(cssGradient: string): Gradient | null {
  if (!isCSSGradient(cssGradient)) {
    return null;
  }

  const isLinear = cssGradient.startsWith('linear-gradient');
  const type: 'linear' | 'radial' = isLinear ? 'linear' : 'radial';

  // Extract content between first ( and last ) to handle nested rgba() parentheses
  const firstParen = cssGradient.indexOf('(');
  const lastParen = cssGradient.lastIndexOf(')');
  if (firstParen === -1 || lastParen === -1 || firstParen >= lastParen) {
    return null;
  }
  const content = cssGradient.substring(firstParen + 1, lastParen);
  if (!content) {
    return null;
  }

  let rotation: number | undefined;
  let colorStopString = content;

  if (isLinear) {
    const angleMatch = content.match(/^([\d.]+)deg\s*,/);
    if (angleMatch) {
      const degrees = parseFloat(angleMatch[1]);
      rotation = (degrees * Math.PI) / 180;
      colorStopString = content.replace(/^[\d.]+deg\s*,\s*/, '');
    }
  }

  const colorStops: GradientColorStop[] = [];
  const stopRegex = /(rgba?\([^)]+\)|#[0-9a-fA-F]{6,8})\s+([\d.]+)%/g;
  let match;

  while ((match = stopRegex.exec(colorStopString)) !== null) {
    const colorStr = match[1];
    const offset = Math.max(0, Math.min(1, parseFloat(match[2]) / 100));

    let color: string;

    if (colorStr.startsWith('rgb')) {
      const parts = colorStr.match(/[\d.]+/g);
      if (parts && parts.length >= 3) {
        const r = parseInt(parts[0]);
        const g = parseInt(parts[1]);
        const b = parseInt(parts[2]);
        const a = parts.length === 4 ? Math.round(parseFloat(parts[3]) * 255) : 255;
        color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${a.toString(16).padStart(2, '0')}`;
      } else {
        continue;
      }
    } else {
      color = colorStr;
      if (color.length === 7) {
        color += 'FF';
      }
    }

    colorStops.push({ offset, color });
  }

  if (colorStops.length === 0) {
    return null;
  }

  const gradient: Gradient = {
    type,
    colorStops,
  };

  if (rotation !== undefined) {
    gradient.rotation = rotation;
  }

  return gradient;
}

export function gradientToCSS(gradient: Gradient): string {
  const { type, rotation, colorStops } = gradient;

  const cssColorStops = colorStops.map((stop) => {
    const { offset, color } = stop;
    const rgba = hexToRGBA(color);
    return `${rgba} ${Math.round(offset * 100)}%`;
  }).join(', ');

  if (type === 'linear') {
    const degrees = rotation !== undefined ? Math.round((rotation * 180) / Math.PI) : 0;
    return `linear-gradient(${degrees}deg, ${cssColorStops})`;
  } else {
    return `radial-gradient(circle, ${cssColorStops})`;
  }
}

function hexToRGBA(hex: string): string {
  hex = hex.replace(/^#/, '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

  return `rgba(${r},${g},${b},${a})`;
}
