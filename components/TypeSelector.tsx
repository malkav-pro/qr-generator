import { QR_TYPES, type QRTypeKey } from '@/lib/formatters';

interface TypeSelectorProps {
  value: QRTypeKey;
  onChange: (type: QRTypeKey) => void;
}

// Human-readable labels for QR types
const typeLabels: Record<QRTypeKey, string> = {
  url: 'URL',
  text: 'Text',
  email: 'Email',
  whatsapp: 'WhatsApp',
  wifi: 'WiFi',
  vcard: 'vCard',
  telegram: 'Telegram',
};

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        QR Code Type
      </label>
      <div className="flex gap-2" role="tablist">
        {QR_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-label={`Select ${typeLabels[type]} type`}
            aria-selected={value === type}
            onClick={() => onChange(type)}
            className={`relative px-5 py-2.5 rounded-lg font-semibold text-sm tracking-tight transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
              ${
              value === type
                ? 'bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-[var(--background)] shadow-[0_0_20px_var(--accent-glow)]'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)] border border-[var(--border-medium)]'
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
