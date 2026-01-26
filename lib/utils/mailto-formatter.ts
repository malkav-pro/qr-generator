import type { EmailData } from '../types/qr-config';

/**
 * Format email data into an RFC 6068 compliant mailto URI
 * https://tools.ietf.org/html/rfc6068
 */
export function formatMailto(data: EmailData): string {
  const { to, subject, body } = data;

  // Start with the email address
  let mailto = `mailto:${to}`;

  // Build query parameters
  const params: string[] = [];

  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }

  if (body) {
    // Line breaks in body should use %0A
    params.push(`body=${encodeURIComponent(body)}`);
  }

  // Add query parameters if any exist
  if (params.length > 0) {
    mailto += `?${params.join('&')}`;
  }

  return mailto;
}
