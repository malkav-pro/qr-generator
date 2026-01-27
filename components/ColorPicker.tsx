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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</label>

        {allowTransparent && (
          <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isTransparent}
                onChange={handleTransparentToggle}
                className="sr-only peer"
              />
              <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center
                ${isTransparent
                  ? 'bg-[var(--accent-start)] border-[var(--accent-start)]'
                  : 'bg-[var(--surface-base)] border-[var(--border-strong)] group-hover:border-[var(--accent-start)]'
                }
                peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-start)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--surface-raised)]`}
              >
                {isTransparent && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <span className="font-medium group-hover:text-[var(--accent-start)] transition-colors duration-200">Transparent</span>
          </label>
        )}
      </div>

      {!isTransparent && (
        <div className="flex items-stretch gap-2.5">
          <input
            type="text"
            value={color}
            onChange={handleHexInput}
            placeholder="#000000"
            className={`flex-1 px-3.5 py-2.5 border rounded-lg font-mono text-sm
              focus:outline-none transition-all duration-200 ${
              isValid
                ? 'border-[var(--border-medium)] focus:border-[var(--accent-start)] focus:shadow-[0_0_0_3px_var(--accent-glow)]'
                : 'border-red-500/50 bg-red-500/5 text-red-400'
            }`}
            maxLength={7}
          />

          <Popover className="relative flex-shrink-0">
            <Popover.Button
              className="relative w-11 h-full rounded-lg border-2 cursor-pointer overflow-hidden
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
                hover:scale-105 hover:shadow-[0_0_16px_var(--accent-glow)]"
              style={{
                backgroundColor: isValid ? color : '#fff',
                borderColor: isValid ? 'var(--border-strong)' : 'var(--border-medium)'
              }}
              title="Click to open color picker"
              aria-label={`${label} color swatch`}
            />

            <Popover.Panel className="absolute z-[100] mt-2 right-0 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-strong)] p-4"
                            style={{ boxShadow: 'var(--shadow-lg)' }}>
              <HexColorPicker color={displayColor} onChange={onChange} />
            </Popover.Panel>
          </Popover>
        </div>
      )}

      {!isTransparent && !isValid && (
        <p className="text-xs text-red-400 font-medium">
          Enter a valid hex color (e.g., #FF0000 or #F00)
        </p>
      )}
    </div>
  );
}
