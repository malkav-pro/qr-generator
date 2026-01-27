import type { QRType } from '@/lib/types/qr-config';

interface TypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

const types: Array<{ value: QRType; label: string }> = [
  { value: 'url', label: 'URL' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
];

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">QR Code Type</label>
      <div className="flex gap-2" role="tablist">
        {types.map((type) => (
          <button
            key={type.value}
            type="button"
            role="tab"
            aria-label={`Select ${type.label} type`}
            aria-selected={value === type.value}
            onClick={() => onChange(type.value)}
            className={`relative px-5 py-2.5 rounded-lg font-semibold text-sm tracking-tight transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
              ${
              value === type.value
                ? 'bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-[var(--background)] shadow-[0_0_20px_var(--accent-glow)]'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)] border border-[var(--border-medium)]'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
