import LZString from 'lz-string';
import type { ShareableConfig } from './types';
import type { QRType } from '@/lib/types/qr-config';

/**
 * Decode URL hash to QR configuration
 *
 * Safely decompresses and validates URL hash strings.
 * Returns null on any error (invalid hash, malformed JSON, missing fields).
 *
 * @param hash - Compressed URL hash string (from encodeConfig)
 * @returns Parsed ShareableConfig or null if invalid
 *
 * @example
 * const hash = "N4IgbiBcIIYA4DsIBsYCdIDYCcoBOCIDmANCAKIA...";
 * const config = decodeConfig(hash);
 * if (config) {
 *   // Valid configuration restored
 * } else {
 *   // Invalid hash, use defaults
 * }
 */
export function decodeConfig(hash: string): ShareableConfig | null {
  try {
    // Decompress the hash
    const json = LZString.decompressFromEncodedURIComponent(hash);
    if (!json) {
      return null;
    }

    // Parse JSON
    const parsed = JSON.parse(json);

    // Basic validation - ensure required fields exist
    if (!isValidConfig(parsed)) {
      return null;
    }

    return parsed as ShareableConfig;
  } catch (error) {
    // Any error (decompression, JSON parsing, etc.) returns null
    console.warn('Failed to decode config from URL hash:', error);
    return null;
  }
}

/**
 * Validate that parsed object has required ShareableConfig fields
 */
function isValidConfig(obj: unknown): obj is ShareableConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const config = obj as Record<string, unknown>;

  // Check required fields
  if (
    typeof config.type !== 'string' ||
    typeof config.data !== 'string' ||
    typeof config.foreground !== 'string' ||
    typeof config.background !== 'string' ||
    typeof config.errorCorrectionLevel !== 'string' ||
    typeof config.scale !== 'number'
  ) {
    return false;
  }

  // Validate type is one of the allowed QR types
  const validTypes: QRType[] = ['url', 'text', 'email'];
  if (!validTypes.includes(config.type as QRType)) {
    return false;
  }

  // Validate error correction level
  const validLevels = ['L', 'M', 'Q', 'H'];
  if (!validLevels.includes(config.errorCorrectionLevel as string)) {
    return false;
  }

  return true;
}
