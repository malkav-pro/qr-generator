'use client';

import { Popover } from '@headlessui/react';
import { HexColorPicker } from 'react-colorful';

type GradientType = 'horizontal' | 'vertical' | 'diagonal' | 'radial';

interface GradientColorPickerProps {
  label: string;
  solidColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientType: GradientType;
  mode: 'solid' | 'gradient';
  onSolidChange: (color: string) => void;
  onGradientStartChange: (color: string) => void;
  onGradientEndChange: (color: string) => void;
  onGradientTypeChange: (type: GradientType) => void;
  onModeChange: (mode: 'solid' | 'gradient') => void;
}

function isValidHex(value: string): boolean {
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value);
}

export function GradientColorPicker({
  label,
  solidColor,
  gradientStart,
  gradientEnd,
  gradientType,
  mode,
  onSolidChange,
  onGradientStartChange,
  onGradientEndChange,
  onGradientTypeChange,
  onModeChange,
}: GradientColorPickerProps) {
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value && !value.startsWith('#')) {
      value = `#${value}`;
    }
    onSolidChange(value);
  };

  const handleModeToggle = (newMode: 'solid' | 'gradient') => {
    if (newMode !== mode) {
      onModeChange(newMode);
    }
  };

  const handleGradientHexInput = (
    field: 'start' | 'end',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    if (value && !value.startsWith('#')) {
      value = `#${value}`;
    }

    if (field === 'start') {
      onGradientStartChange(value);
    } else {
      onGradientEndChange(value);
    }
  };

  const isValidSolid = isValidHex(solidColor);
  const isValidStart = isValidHex(gradientStart);
  const isValidEnd = isValidHex(gradientEnd);

  const gradientCSS = buildGradientCSS(gradientType, gradientStart, gradientEnd);
  const previewStyle: React.CSSProperties = mode === 'solid'
    ? { backgroundColor: isValidSolid ? solidColor : '#fff' }
    : { background: gradientCSS };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-md w-fit">
        <button
          type="button"
          onClick={() => handleModeToggle('solid')}
          className={`px-3 py-1 text-sm rounded transition-colors duration-150 motion-reduce:transition-none ${
            mode === 'solid'
              ? 'bg-white text-gray-900 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Solid
        </button>
        <button
          type="button"
          onClick={() => handleModeToggle('gradient')}
          className={`px-3 py-1 text-sm rounded transition-colors duration-150 motion-reduce:transition-none ${
            mode === 'gradient'
              ? 'bg-white text-gray-900 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Gradient
        </button>
      </div>

      {mode === 'solid' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={solidColor}
              onChange={handleHexInput}
              placeholder="#000000"
              className={`flex-1 px-3 py-2 h-10 border rounded-lg font-mono text-sm text-gray-900
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                transition-colors duration-150 motion-reduce:transition-none ${
                isValidSolid ? 'border-[var(--color-border)]' : 'border-red-400 bg-red-50'
              }`}
              maxLength={7}
            />

            <Popover className="relative">
              <Popover.Button
                className="w-10 h-10 rounded-lg border-2 border-[var(--color-border)] cursor-pointer
                  hover:border-[var(--color-primary)] transition-colors duration-150 motion-reduce:transition-none
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                style={previewStyle}
                title="Click to open color picker"
              />

              <Popover.Panel className="absolute z-10 mt-2 right-0 bg-white rounded-lg shadow-lg border border-[var(--color-border)] p-3">
                <HexColorPicker color={solidColor} onChange={onSolidChange} />
              </Popover.Panel>
            </Popover>
          </div>

          {!isValidSolid && (
            <p className="text-xs text-red-600">
              Enter a valid hex color (e.g., #FF0000 or #F00)
            </p>
          )}
        </div>
      )}

      {mode === 'gradient' && (
        <div className="space-y-3">
          <div
            className="w-full h-10 rounded-lg border-2 border-[var(--color-border)]"
            style={previewStyle}
            aria-label={`${label} gradient preview`}
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">Start</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gradientStart}
                  onChange={(e) => handleGradientHexInput('start', e)}
                  placeholder="#000000"
                  className={`flex-1 px-2 py-1.5 h-10 border rounded-lg font-mono text-xs text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                    transition-colors duration-150 motion-reduce:transition-none ${
                    isValidStart ? 'border-[var(--color-border)]' : 'border-red-400 bg-red-50'
                  }`}
                  maxLength={7}
                />
                <Popover className="relative">
                  <Popover.Button
                    className="w-10 h-10 rounded-lg border-2 border-[var(--color-border)] cursor-pointer
                      hover:border-[var(--color-primary)] transition-colors duration-150 motion-reduce:transition-none
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 shrink-0"
                    style={{ backgroundColor: isValidStart ? gradientStart : '#fff' }}
                  />
                  <Popover.Panel className="absolute z-10 mt-2 right-0 bg-white rounded-lg shadow-lg border border-[var(--color-border)] p-3">
                    <HexColorPicker color={gradientStart} onChange={onGradientStartChange} />
                  </Popover.Panel>
                </Popover>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-600">End</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gradientEnd}
                  onChange={(e) => handleGradientHexInput('end', e)}
                  placeholder="#333333"
                  className={`flex-1 px-2 py-1.5 h-10 border rounded-lg font-mono text-xs text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
                    transition-colors duration-150 motion-reduce:transition-none ${
                    isValidEnd ? 'border-[var(--color-border)]' : 'border-red-400 bg-red-50'
                  }`}
                  maxLength={7}
                />
                <Popover className="relative">
                  <Popover.Button
                    className="w-10 h-10 rounded-lg border-2 border-[var(--color-border)] cursor-pointer
                      hover:border-[var(--color-primary)] transition-colors duration-150 motion-reduce:transition-none
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 shrink-0"
                    style={{ backgroundColor: isValidEnd ? gradientEnd : '#fff' }}
                  />
                  <Popover.Panel className="absolute z-10 mt-2 right-0 bg-white rounded-lg shadow-lg border border-[var(--color-border)] p-3">
                    <HexColorPicker color={gradientEnd} onChange={onGradientEndChange} />
                  </Popover.Panel>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-600">Direction</label>
            <div className="flex flex-wrap gap-1.5">
              {(['horizontal', 'vertical', 'diagonal', 'radial'] as GradientType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onGradientTypeChange(type)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors duration-150
                    motion-reduce:transition-none ${
                    gradientType === type
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white text-gray-700 border-[var(--color-border)] hover:border-gray-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildGradientCSS(type: GradientType, start: string, end: string): string {
  const safeStart = isValidHex(start) ? start : '#000000';
  const safeEnd = isValidHex(end) ? end : '#333333';

  switch (type) {
    case 'vertical':
      return `linear-gradient(180deg, ${safeStart} 0%, ${safeEnd} 100%)`;
    case 'diagonal':
      return `linear-gradient(135deg, ${safeStart} 0%, ${safeEnd} 100%)`;
    case 'radial':
      return `radial-gradient(circle, ${safeStart} 0%, ${safeEnd} 100%)`;
    case 'horizontal':
    default:
      return `linear-gradient(90deg, ${safeStart} 0%, ${safeEnd} 100%)`;
  }
}
