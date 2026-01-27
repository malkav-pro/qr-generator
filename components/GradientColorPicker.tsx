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
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</label>

      <div className="flex gap-1 p-1 bg-[var(--surface-base)] rounded-lg border border-[var(--border-medium)] w-fit">
        <button
          type="button"
          onClick={() => handleModeToggle('solid')}
          className={`px-3.5 py-2 text-sm rounded-md font-semibold tracking-tight transition-all duration-200 ${
            mode === 'solid'
              ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Solid
        </button>
        <button
          type="button"
          onClick={() => handleModeToggle('gradient')}
          className={`px-3.5 py-2 text-sm rounded-md font-semibold tracking-tight transition-all duration-200 ${
            mode === 'gradient'
              ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Gradient
        </button>
      </div>

      {mode === 'solid' && (
        <div className="flex items-stretch gap-2.5">
          <input
            type="text"
            value={solidColor}
            onChange={handleHexInput}
            placeholder="#000000"
            className="flex-1 px-3.5 py-2.5 border rounded-lg font-mono text-sm
              transition-all duration-200
              focus:outline-none"
            maxLength={7}
          />

          <Popover className="relative flex-shrink-0">
            <Popover.Button
              className="w-11 h-full rounded-lg border-2 cursor-pointer
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
                hover:scale-105 hover:shadow-[0_0_16px_var(--accent-glow)]"
              style={{
                ...previewStyle,
                borderColor: 'var(--border-strong)'
              }}
              title="Click to open color picker"
            />

            <Popover.Panel className="absolute z-[100] mt-2 right-0 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-strong)] p-4"
                            style={{ boxShadow: 'var(--shadow-lg)' }}>
              <HexColorPicker color={solidColor} onChange={onSolidChange} />
            </Popover.Panel>
          </Popover>
        </div>
      )}

      {mode === 'gradient' && (
        <div className="space-y-3">
          {/* Start Color */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Start
            </label>
            <div className="flex items-stretch gap-2.5">
              <input
                type="text"
                value={gradientStart}
                onChange={(e) => handleGradientHexInput('start', e)}
                placeholder="#000000"
                className={`flex-1 px-3.5 py-2.5 border rounded-lg font-mono text-sm
                  transition-all duration-200
                  focus:outline-none ${
                  isValidStart
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
                    backgroundColor: isValidStart ? gradientStart : '#000',
                    borderColor: isValidStart ? 'var(--border-strong)' : 'var(--border-medium)'
                  }}
                  title="Click to open color picker"
                />

                <Popover.Panel className="absolute z-[100] mt-2 right-0 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-strong)] p-4"
                                style={{ boxShadow: 'var(--shadow-lg)' }}>
                  <HexColorPicker color={gradientStart} onChange={onGradientStartChange} />
                </Popover.Panel>
              </Popover>
            </div>
            {!isValidStart && (
              <p className="text-xs text-red-400 font-medium">
                Enter a valid hex color (e.g., #FF0000)
              </p>
            )}
          </div>

          {/* End Color */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              End
            </label>
            <div className="flex items-stretch gap-2.5">
              <input
                type="text"
                value={gradientEnd}
                onChange={(e) => handleGradientHexInput('end', e)}
                placeholder="#333333"
                className={`flex-1 px-3.5 py-2.5 border rounded-lg font-mono text-sm
                  transition-all duration-200
                  focus:outline-none ${
                  isValidEnd
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
                    backgroundColor: isValidEnd ? gradientEnd : '#333',
                    borderColor: isValidEnd ? 'var(--border-strong)' : 'var(--border-medium)'
                  }}
                  title="Click to open color picker"
                />

                <Popover.Panel className="absolute z-[100] mt-2 right-0 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-strong)] p-4"
                                style={{ boxShadow: 'var(--shadow-lg)' }}>
                  <HexColorPicker color={gradientEnd} onChange={onGradientEndChange} />
                </Popover.Panel>
              </Popover>
            </div>
            {!isValidEnd && (
              <p className="text-xs text-red-400 font-medium">
                Enter a valid hex color (e.g., #FF0000)
              </p>
            )}
          </div>

          {/* Gradient Type */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Direction
            </label>
            <div className="flex flex-wrap gap-2">
              {(['horizontal', 'vertical', 'diagonal', 'radial'] as GradientType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onGradientTypeChange(type)}
                  className={`px-3.5 py-2 text-xs font-semibold tracking-tight rounded-lg border transition-all duration-200 ${
                    gradientType === type
                      ? 'bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-[var(--background)] border-transparent shadow-[0_0_16px_var(--accent-glow)]'
                      : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border-medium)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)]'
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
