import { z } from 'zod';

// Escape special characters for WiFi QR format
// CRITICAL: Backslash FIRST to avoid double-escaping
function escapeWiFiSpecialChars(text: string): string {
  return text
    .replace(/\\/g, '\\\\')  // Backslash FIRST
    .replace(/;/g, '\\;')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"');
}

// Discriminated union schema based on encryption type
export const wifiSchema = z.discriminatedUnion('encryption', [
  // Open network (no password)
  z.object({
    encryption: z.literal('nopass'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less'),
    hidden: z.boolean().default(false),
  }),

  // WPA/WPA2 (most common)
  z.object({
    encryption: z.literal('WPA'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less'),
    password: z.string()
      .min(8, 'WPA password must be at least 8 characters')
      .max(63, 'WPA password must be 63 characters or less'),
    hidden: z.boolean().default(false),
  }),

  // WEP (legacy)
  z.object({
    encryption: z.literal('WEP'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less'),
    password: z.string().refine(
      (val) => val.length === 5 || val.length === 13,
      { message: 'WEP password must be exactly 5 or 13 characters' }
    ),
    hidden: z.boolean().default(false),
  }),
]);

export type WiFiData = z.infer<typeof wifiSchema>;

// Format WiFi data as WIFI: QR string
export function formatWiFi(data: WiFiData): string {
  const escapedSsid = escapeWiFiSpecialChars(data.ssid);

  // Determine encryption type string
  let encType = '';
  let escapedPassword = '';

  if (data.encryption === 'WPA') {
    encType = 'WPA';
    escapedPassword = escapeWiFiSpecialChars(data.password);
  } else if (data.encryption === 'WEP') {
    encType = 'WEP';
    escapedPassword = escapeWiFiSpecialChars(data.password);
  }
  // nopass: encType stays empty, password stays empty

  // Hidden flag: 'true' or empty string (never 'false')
  const hiddenFlag = data.hidden ? 'true' : '';

  // WIFI format MUST end with ;; (double semicolon)
  return `WIFI:T:${encType};S:${escapedSsid};P:${escapedPassword};H:${hiddenFlag};;`;
}
