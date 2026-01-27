import { z } from 'zod';

export const whatsappSchema = z.object({
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+[1-9]\d{6,14}$/, 'Must be valid E.164 format (e.g., +12025550172)'),
  message: z.string()
    .max(500, 'Message must be 500 characters or less')
    .optional(),
});

export type WhatsAppData = z.infer<typeof whatsappSchema>;

export function formatWhatsApp(data: WhatsAppData): string {
  // Strip + prefix from phone number
  const cleanPhone = data.phoneNumber.replace(/^\+/, '');

  // Build wa.me URL
  let url = `https://wa.me/${cleanPhone}`;

  // Append message if provided and not empty
  if (data.message && data.message.trim()) {
    url += `?text=${encodeURIComponent(data.message)}`;
  }

  return url;
}
