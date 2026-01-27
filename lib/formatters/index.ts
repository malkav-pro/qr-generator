// URL type
export { urlSchema, type UrlData, formatUrl } from './url';

// Text type
export { textSchema, type TextData, formatText } from './text';

// Email type
export { emailSchema, type EmailData, formatEmail } from './email';

// QR type keys for registry (v1.0 types)
export const QR_TYPES = ['url', 'text', 'email'] as const;
export type QRTypeKey = typeof QR_TYPES[number];
