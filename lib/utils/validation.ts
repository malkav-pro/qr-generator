/**
 * Input validation utilities
 * For user feedback, not security (trust no user input for security purposes)
 */

/**
 * Basic URL validation
 * Checks for valid URL format with protocol
 */
export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    // Must have http or https protocol
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Email format validation
 * Basic check for email-like format
 */
export function isValidEmail(input: string): boolean {
  // Simple regex for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}
