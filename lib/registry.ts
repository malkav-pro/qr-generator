import { ComponentType } from 'react';
import { UrlForm } from '@/components/forms/qr-forms/UrlForm';
import { TextForm } from '@/components/forms/qr-forms/TextForm';
import { EmailForm } from '@/components/forms/qr-forms/EmailForm';
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
};

// Get form component for a QR type (type-safe lookup)
export function getQRForm(type: QRTypeKey): ComponentType<QRFormProps> {
  return qrFormRegistry[type];
}
