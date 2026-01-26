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
      <label className="block text-sm font-medium">QR Code Type</label>
      <div className="flex gap-2" role="tablist">
        {types.map((type) => (
          <button
            key={type.value}
            type="button"
            role="tab"
            aria-label={`Select ${type.label} type`}
            aria-selected={value === type.value}
            onClick={() => onChange(type.value)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              value === type.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
