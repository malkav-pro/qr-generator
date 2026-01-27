// URL type
export { urlSchema, type UrlData, formatUrl } from './url';

// Text type
export { textSchema, type TextData, formatText } from './text';

// Email type
export { emailSchema, type EmailData, formatEmail } from './email';

// WhatsApp type
export { whatsappSchema, type WhatsAppData, formatWhatsApp } from './whatsapp';

// WiFi type
export { wifiSchema, type WiFiData, formatWiFi } from './wifi';

// QR type keys for registry (v1.0 types + v1.1 simple types)
export const QR_TYPES = ['url', 'text', 'email', 'whatsapp', 'wifi'] as const;
export type QRTypeKey = typeof QR_TYPES[number];
