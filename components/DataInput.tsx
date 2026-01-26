import type { QRType, EmailData } from '@/lib/types/qr-config';
import { formatMailto } from '@/lib/utils/mailto-formatter';
import { isValidUrl, isValidEmail } from '@/lib/utils/validation';

interface DataInputProps {
  type: QRType;
  value: string;
  emailData?: EmailData;
  onChange: (data: string) => void;
  onEmailChange?: (data: EmailData) => void;
}

export function DataInput({
  type,
  value,
  emailData,
  onChange,
  onEmailChange,
}: DataInputProps) {
  const handleEmailFieldChange = (field: keyof EmailData, fieldValue: string) => {
    if (!onEmailChange) return;

    const newEmailData: EmailData = {
      to: emailData?.to || '',
      subject: emailData?.subject,
      body: emailData?.body,
      [field]: fieldValue,
    };

    // Update email data
    onEmailChange(newEmailData);

    // Generate mailto URI and pass to onChange
    const mailto = formatMailto(newEmailData);
    onChange(mailto);
  };

  if (type === 'url') {
    const showValidationHint = value.length > 0 && !isValidUrl(value);

    return (
      <div className="space-y-2">
        <label htmlFor="url-input" className="block text-sm font-medium">
          URL
        </label>
        <input
          id="url-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showValidationHint && (
          <p className="text-sm text-amber-600">
            Hint: URL should start with http:// or https://
          </p>
        )}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        <label htmlFor="text-input" className="block text-sm font-medium">
          Text
        </label>
        <textarea
          id="text-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter any text..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }

  if (type === 'email') {
    const showEmailValidationHint =
      emailData?.to && emailData.to.length > 0 && !isValidEmail(emailData.to);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email-to" className="block text-sm font-medium">
            To <span className="text-red-500">*</span>
          </label>
          <input
            id="email-to"
            type="email"
            value={emailData?.to || ''}
            onChange={(e) => handleEmailFieldChange('to', e.target.value)}
            placeholder="recipient@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showEmailValidationHint && (
            <p className="text-sm text-amber-600">
              Hint: Please enter a valid email address
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email-subject" className="block text-sm font-medium">
            Subject <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            id="email-subject"
            type="text"
            value={emailData?.subject || ''}
            onChange={(e) => handleEmailFieldChange('subject', e.target.value)}
            placeholder="Email subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email-body" className="block text-sm font-medium">
            Body <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            id="email-body"
            value={emailData?.body || ''}
            onChange={(e) => handleEmailFieldChange('body', e.target.value)}
            placeholder="Email body"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  return null;
}
