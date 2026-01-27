import { z } from 'zod';

// E.164 phone validation (reuse WhatsApp pattern)
const e164Regex = /^\+[1-9]\d{6,14}$/;

// vCard schema with 8 fields
export const vcardSchema = z.object({
  // Required fields
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),

  // Optional fields
  phoneNumber: z.string()
    .regex(e164Regex, 'Phone must be in E.164 format (e.g., +12025550172)')
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
  company: z.string()
    .max(100, 'Company must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  title: z.string()
    .max(100, 'Title must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  department: z.string()
    .max(100, 'Department must be 100 characters or less')
    .optional()
    .or(z.literal('')),
});

export type VCardData = z.infer<typeof vcardSchema>;

// Format vCard data as RFC 2426 compliant vCard 3.0 string
export function formatVCard(data: VCardData): string {
  // Manual vCard 3.0 generation to avoid vcards-js Node.js dependencies in browser
  const lines: string[] = [];

  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');

  // Format full name
  const fullName = `${data.firstName} ${data.lastName}`;
  lines.push(`FN:${escapeVCardValue(fullName)}`);

  // Format structured name (N: LastName;FirstName;MiddleName;Prefix;Suffix)
  lines.push(`N:${escapeVCardValue(data.lastName)};${escapeVCardValue(data.firstName)};;;`);

  // Optional fields
  if (data.phoneNumber && data.phoneNumber.trim()) {
    lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(data.phoneNumber)}`);
  }
  if (data.email && data.email.trim()) {
    lines.push(`EMAIL:${escapeVCardValue(data.email)}`);
  }
  if (data.website && data.website.trim()) {
    lines.push(`URL:${escapeVCardValue(data.website)}`);
  }
  if (data.company && data.company.trim()) {
    lines.push(`ORG:${escapeVCardValue(data.company)}`);
  }
  if (data.title && data.title.trim()) {
    lines.push(`TITLE:${escapeVCardValue(data.title)}`);
  }
  if (data.department && data.department.trim()) {
    lines.push(`ROLE:${escapeVCardValue(data.department)}`);
  }

  lines.push('END:VCARD');

  return lines.join('\r\n');
}

// Escape special characters in vCard values per RFC 2426
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')  // Backslash
    .replace(/;/g, '\\;')    // Semicolon
    .replace(/,/g, '\\,')    // Comma
    .replace(/\n/g, '\\n');  // Newline
}

// Get character count for vCard data (supports partial data for real-time counting)
export function getVCardCharacterCount(data: Partial<VCardData>): number {
  try {
    // If we have valid complete data, get exact count
    const result = vcardSchema.safeParse(data);
    if (result.success) {
      return formatVCard(result.data).length;
    }

    // For incomplete data, estimate using field lengths + 150 overhead
    // vCard 3.0 overhead includes: BEGIN:VCARD, VERSION:3.0, END:VCARD, field labels, CRLF
    let estimate = 150; // Base overhead

    if (data.firstName) estimate += data.firstName.length;
    if (data.lastName) estimate += data.lastName.length;
    if (data.phoneNumber) estimate += data.phoneNumber.length;
    if (data.email) estimate += data.email.length;
    if (data.website) estimate += data.website.length;
    if (data.company) estimate += data.company.length;
    if (data.title) estimate += data.title.length;
    if (data.department) estimate += data.department.length;

    return estimate;
  } catch (error) {
    return 0;
  }
}
