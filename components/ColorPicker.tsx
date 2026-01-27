'use client';

import { Popover } from '@headlessui/react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  allowTransparent?: boolean;
}

// Validate hex color format
function isValidHex(value: string): boolean {
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value);
}

export function ColorPicker({
  label,
  color,
  onChange,
  allowTransparent = false
}: ColorPickerProps) {
  const isTransparent = color === 'transparent';
  const displayColor = isTransparent ? '#ffffff' : color;
  const isValid = isTransparent || isValidHex(color);

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value && !value.startsWith('#')) {
      value = `#${value}`;
    }
    onChange(value);
  };

  const handleTransparentToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange('transparent');
    } else {
      onChange('#ffffff');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>

      {allowTransparent && (
        <label className="flex items-center gap-2 text-sm text-gray-900">
          <input
            type="checkbox"
            checked={isTransparent}
            onChange={handleTransparentToggle}
            className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          />
          <span>Transparent</span>
        </label>
      )}

      {!isTransparent && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={color}
            onChange={handleHexInput}
            placeholder="#000000"
            className={`flex-1 px-3 py-2 h-10 border rounded-lg font-mono text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
              transition-colors duration-150 motion-reduce:transition-none ${
              isValid ? 'border-[var(--color-border)]' : 'border-red-400 bg-red-50'
            }`}
            maxLength={7}
          />

          <Popover className="relative">
            <Popover.Button
              className="w-10 h-10 rounded-lg border-2 border-[var(--color-border)] cursor-pointer
                hover:border-[var(--color-primary)] transition-colors duration-150 motion-reduce:transition-none
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              style={{ backgroundColor: isValid ? color : '#fff' }}
              title="Click to open color picker"
              aria-label={`${label} color swatch`}
            />

            <Popover.Panel className="absolute z-10 mt-2 right-0 bg-white rounded-lg shadow-lg border border-[var(--color-border)] p-3">
              <HexColorPicker color={displayColor} onChange={onChange} />
            </Popover.Panel>
          </Popover>
        </div>
      )}

      {!isTransparent && !isValid && (
        <p className="text-xs text-red-600">
          Enter a valid hex color (e.g., #FF0000 or #F00)
        </p>
      )}
    </div>
  );
}
