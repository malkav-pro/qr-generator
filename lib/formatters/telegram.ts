import { z } from 'zod';

// Discriminated union schema based on Telegram link mode
export const telegramSchema = z.discriminatedUnion('mode', [
  // Username mode (regular Telegram user)
  z.object({
    mode: z.literal('username'),
    username: z.string()
      .min(1, 'Username is required')
      .transform((val) => val.replace(/^@/, ''))  // Auto-strip @ prefix
      .pipe(
        z.string()
          .min(5, 'Username must be at least 5 characters')
          .max(32, 'Username must be 32 characters or less')
          .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      ),
  }),

  // Phone mode (contact via phone number)
  z.object({
    mode: z.literal('phone'),
    phoneNumber: z.string()
      .min(1, 'Phone number is required')
      .regex(/^\+[1-9]\d{6,14}$/, 'Must be valid E.164 format (e.g., +12025550172)'),
  }),

  // Bot mode (Telegram bot)
  z.object({
    mode: z.literal('bot'),
    botUsername: z.string()
      .min(1, 'Bot username is required')
      .transform((val) => val.replace(/^@/, ''))  // Auto-strip @ prefix
      .pipe(
        z.string()
          .min(5, 'Bot username must be at least 5 characters')
          .max(32, 'Bot username must be 32 characters or less')
          .regex(/^[a-zA-Z0-9_]+$/, 'Bot username can only contain letters, numbers, and underscores')
          .refine(
            (val) => val.toLowerCase().endsWith('bot') || val.toLowerCase().endsWith('_bot'),
            'Bot username must end with "bot" or "_bot"'
          )
      ),
  }),
]);

export type TelegramData = z.infer<typeof telegramSchema>;

// Format Telegram data as t.me URL
export function formatTelegram(data: TelegramData): string {
  switch (data.mode) {
    case 'username':
      // Username link: t.me/username
      return `https://t.me/${data.username}`;

    case 'phone':
      // Phone link: t.me/+1234567890 (includes + prefix)
      return `https://t.me/${data.phoneNumber}`;

    case 'bot':
      // Bot link: t.me/botusername
      return `https://t.me/${data.botUsername}`;
  }
}
