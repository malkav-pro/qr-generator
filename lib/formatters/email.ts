import { z } from 'zod';
import { formatMailto } from '@/lib/utils/mailto-formatter';

export const emailSchema = z.object({
  to: z.string()
    .min(1, 'Email address is required')
    .email('Must be a valid email address'),
  subject: z.string()
    .max(200, 'Subject must be 200 characters or less')
    .optional(),
  body: z.string()
    .max(1000, 'Body must be 1000 characters or less')
    .optional(),
});

export type EmailData = z.infer<typeof emailSchema>;

// Formatter uses existing mailto-formatter
export function formatEmail(data: EmailData): string {
  return formatMailto({
    to: data.to,
    subject: data.subject || undefined,
    body: data.body || undefined,
  });
}
