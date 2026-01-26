/**
 * Logo validation utilities for QR code logo uploads
 *
 * Validates file type, size, and provides recommendations for optimal logo sizing
 * to maintain QR code scannability (max 25% of QR area).
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface PercentageResult {
  percentage: number;
  level: 'safe' | 'warning' | 'danger';
}

export interface RecommendedSize {
  width: number;
  height: number;
}

/**
 * Validates logo file type and size
 *
 * @param file - File object to validate
 * @returns ValidationResult with valid flag and optional error message
 */
export function validateLogoFile(file: File): ValidationResult {
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
 * Calculates what percentage of the QR code the logo occupies
 *
 * @param logoWidth - Width of logo in pixels
 * @param logoHeight - Height of logo in pixels
 * @param qrSize - Size of QR code in pixels (assumed square)
 * @returns PercentageResult with percentage and safety level
 */
export function calculateLogoPercentage(
  logoWidth: number,
  logoHeight: number,
  qrSize: number
): PercentageResult {
  const logoArea = logoWidth * logoHeight;
  const qrArea = qrSize * qrSize;
  const percentage = (logoArea / qrArea) * 100;

  let level: 'safe' | 'warning' | 'danger';
  if (percentage <= 20) {
    level = 'safe';
  } else if (percentage <= 25) {
    level = 'warning';
  } else {
    level = 'danger';
  }

  return { percentage, level };
}

/**
 * Returns recommended maximum logo dimensions for 20% coverage
 *
 * @param qrSize - Size of QR code in pixels (assumed square)
 * @returns RecommendedSize with width and height
 */
export function getRecommendedLogoSize(qrSize: number): RecommendedSize {
  // For 20% coverage: logoArea = qrArea * 0.20
  // For square logo: side^2 = qrSize^2 * 0.20
  // side = qrSize * sqrt(0.20)
  const side = Math.floor(qrSize * Math.sqrt(0.20));

  return {
    width: side,
    height: side,
  };
}
