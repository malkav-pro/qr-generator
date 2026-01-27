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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-text)]">QR Code Type</label>
      <div className="flex gap-2" role="tablist">
        {types.map((type) => (
          <button
            key={type.value}
            type="button"
            role="tab"
            aria-label={`Select ${type.label} type`}
            aria-selected={value === type.value}
            onClick={() => onChange(type.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2
              motion-reduce:transition-none ${
              value === type.value
                ? 'bg-[var(--color-primary)] text-white border border-[var(--color-primary)]'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-transparent'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
