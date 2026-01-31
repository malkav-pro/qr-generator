/**
 * Background image validation utilities for QR code background uploads
 *
 * Validates file type, size, and dimensions to prevent browser crashes
 * and ensure compatibility with iOS Safari canvas limits (16.7MP).
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates background file type and size
 *
 * @param file - File object to validate
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateBackgroundFile(file: File): ValidationResult {
  // Check file type - only PNG and JPEG allowed
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PNG and JPG images are supported',
    };
  }

  // Check file size - max 5MB
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB',
    };
  }

  return { valid: true };
}

/**
 * Validates image dimensions against browser canvas limits
 *
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateImageDimensions(
  width: number,
  height: number
): ValidationResult {
  const MAX_DIMENSION = 4000; // Pixels
  const MAX_AREA = 16777216; // 16.7MP (iOS Safari limit)

  if (width === 0 || height === 0) {
    return {
      valid: false,
      error: 'Image dimensions could not be determined',
    };
  }

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      valid: false,
      error: `Image must be smaller than ${MAX_DIMENSION}x${MAX_DIMENSION}px (got ${width}x${height}px)`,
    };
  }

  // Check total pixel area for iOS Safari limit
  if (width * height > MAX_AREA) {
    return {
      valid: false,
      error: 'Image area exceeds browser limits (max 16.7 megapixels)',
    };
  }

  return { valid: true };
}
