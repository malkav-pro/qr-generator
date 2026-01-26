/**
 * URL State Management for QR Code Sharing
 *
 * Provides encoding/decoding utilities for sharing QR configurations via URL.
 * Uses lz-string compression to keep URLs short and readable.
 *
 * Note: Logos are not included in shareable URLs due to size constraints.
 */

export { encodeConfig } from './encode';
export { decodeConfig } from './decode';
export {
  toShareableConfig,
  fromShareableConfig,
  type ShareableConfig,
} from './types';
