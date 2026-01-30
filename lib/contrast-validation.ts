/**
 * WCAG 2.0 Contrast Validation
 * Implements the relative luminance and contrast ratio formulas from WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */

import { Gradient, GradientColorStop } from '@/lib/types/gradient';

/**
 * Parse hex color to RGB values
 * Handles 3-char (#FFF), 6-char (#FFFFFF), and 8-char (#FFFFFFFF with alpha) formats
 * Alpha channel is stripped - only RGB is used for luminance calculation
 */
function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Handle 3-char format (#FFF -> #FFFFFF)
  // Handle 8-char format (#RRGGBBAA -> #RRGGBB, strip alpha)
  let rgbHex: string;
  if (cleanHex.length === 3) {
    rgbHex = cleanHex.split('').map(char => char + char).join('');
  } else if (cleanHex.length === 8) {
    // Strip alpha channel (last 2 chars)
    rgbHex = cleanHex.substring(0, 6);
  } else {
    rgbHex = cleanHex;
  }

  const num = parseInt(rgbHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return [r, g, b];
}

/**
 * Calculate relative luminance of a color according to WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getRelativeLuminance(hexColor: string): number {
  const [r, g, b] = hexToRgb(hexColor);

  // Convert to 0-1 range
  const [rs, gs, bs] = [r / 255, g / 255, b / 255];

  // Apply gamma correction
  const [rLinear, gLinear, bLinear] = [rs, gs, bs].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors according to WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate that two colors meet a minimum contrast ratio
 * Default minimum is 12:1 for QR code scannability
 * Returns true for transparent backgrounds (contrast depends on placement)
 */
export function validateContrast(
  fg: string,
  bg: string,
  minRatio: number = 12
): boolean {
  // Transparent backgrounds can't be validated - allow export
  if (bg === 'transparent') {
    return true;
  }
  const ratio = calculateContrastRatio(fg, bg);
  return ratio >= minRatio;
}

/**
 * Validate that all color stops in a gradient meet minimum contrast ratio against background
 * Default minimum is 4.5:1 (WCAG AA standard)
 * Returns validation result with worst-case stop info
 */
export function validateGradientContrast(
  gradient: Gradient,
  background: string,
  minRatio: number = 4.5
): { valid: boolean; worstRatio: number; worstStop: GradientColorStop | null } {
  // Transparent backgrounds can't be validated - allow export
  if (background === 'transparent') {
    return { valid: true, worstRatio: Infinity, worstStop: null };
  }

  // Empty gradient is considered valid
  if (gradient.colorStops.length === 0) {
    return { valid: true, worstRatio: Infinity, worstStop: null };
  }

  // Check all stops and track worst case
  let worstRatio = Infinity;
  let worstStop: GradientColorStop | null = null;

  for (const stop of gradient.colorStops) {
    const ratio = calculateContrastRatio(stop.color, background);
    if (ratio < worstRatio) {
      worstRatio = ratio;
      worstStop = stop;
    }
  }

  return {
    valid: worstRatio >= minRatio,
    worstRatio,
    worstStop
  };
}

/**
 * Validate all gradients in a QR config against the background
 * Returns array of validation failures with details
 */
export function validateAllGradients(config: {
  foregroundGradient?: Gradient;
  background: string;
}): Array<{ field: string; worstRatio: number; worstStop: GradientColorStop }> {
  const failures: Array<{ field: string; worstRatio: number; worstStop: GradientColorStop }> = [];

  if (config.foregroundGradient) {
    const result = validateGradientContrast(config.foregroundGradient, config.background);
    if (!result.valid && result.worstStop) {
      failures.push({
        field: 'foregroundGradient',
        worstRatio: result.worstRatio,
        worstStop: result.worstStop
      });
    }
  }

  return failures;
}
