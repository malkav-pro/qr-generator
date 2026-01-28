import { ComponentType } from 'react';
import { UrlForm } from '@/components/forms/qr-forms/UrlForm';
import { TextForm } from '@/components/forms/qr-forms/TextForm';
import { EmailForm } from '@/components/forms/qr-forms/EmailForm';
import { WhatsAppForm } from '@/components/forms/qr-forms/WhatsAppForm';
import { WiFiForm } from '@/components/forms/qr-forms/WiFiForm';
import { VCardForm } from '@/components/forms/qr-forms/VCardForm';
import { TelegramForm } from '@/components/forms/qr-forms/TelegramForm';
import { EventForm } from '@/components/forms/qr-forms/EventForm';
import { QRTypeKey } from './formatters';

// Common props all QR form components accept
export type QRFormProps = {
  onDataChange: (data: string) => void;
  initialValue?: any;
};

// Registry mapping QR type keys to form components
export const qrFormRegistry: Record<QRTypeKey, ComponentType<QRFormProps>> = {
  url: UrlForm,
  text: TextForm,
  email: EmailForm,
  whatsapp: WhatsAppForm,
  wifi: WiFiForm,
  vcard: VCardForm,
  telegram: TelegramForm,
  event: EventForm,
};

// Get form component for a QR type (type-safe lookup)
export function getQRForm(type: QRTypeKey): ComponentType<QRFormProps> {
  return qrFormRegistry[type];
}
