import LZString from 'lz-string';
import type { ShareableConfig } from './types';

/**
 * Encode QR configuration to URL-safe compressed string
 *
 * Uses lz-string compression with URI component encoding to produce
 * short, URL-safe strings without +, /, or = characters.
 *
 * Typical compression results:
 * - Simple config (URL + solid colors): ~50-100 chars
 * - Complex config (gradients + styles): ~150-300 chars
 *
 * @param config - Shareable QR configuration (no logo)
 * @returns URL-safe compressed string
 *
 * @example
 * const config = {
 *   type: 'url',
 *   data: 'https://example.com',
 *   foreground: '#000000',
 *   background: '#ffffff',
 *   errorCorrectionLevel: 'H',
 *   scale: 4
 * };
 * const encoded = encodeConfig(config);
 * // encoded: "N4IgbiBcIIYA4DsIBsYCdIDYCcoBOCIDmANCAKIA..."
 */
export function encodeConfig(config: ShareableConfig): string {
  const json = JSON.stringify(config);
  return LZString.compressToEncodedURIComponent(json);
}
