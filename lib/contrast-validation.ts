/**
 * WCAG 2.0 Contrast Validation
 * Implements the relative luminance and contrast ratio formulas from WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */

/**
 * Parse hex color to RGB values
 * Handles both 3-char (#FFF) and 6-char (#FFFFFF) formats
 */
function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Handle 3-char format (#FFF -> #FFFFFF)
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;

  const num = parseInt(fullHex, 16);
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
 */
export function validateContrast(
  fg: string,
  bg: string,
  minRatio: number = 12
): boolean {
  const ratio = calculateContrastRatio(fg, bg);
  return ratio >= minRatio;
}
