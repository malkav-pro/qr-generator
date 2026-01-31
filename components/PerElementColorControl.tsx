'use client';

import { ColorPicker } from '@/components';
import { MultiStopGradientPicker } from './MultiStopGradientPicker';
import { SectionHeader } from './SectionHeader';
import { Gradient } from '@/lib/types/gradient';

interface PerElementColorControlProps {
  label: string;
  mode: 'solid' | 'gradient';
  solidColor: string;
  gradient: Gradient | null;
  onModeChange: (mode: 'solid' | 'gradient') => void;
  onSolidColorChange: (color: string) => void;
  onGradientChange: (gradient: Gradient | null) => void;
  disabled?: boolean;
  allowTransparent?: boolean;
  headerAction?: React.ReactNode;
}

export function PerElementColorControl({
  label,
  mode,
  solidColor,
  gradient,
  onModeChange,
  onSolidColorChange,
  onGradientChange,
  disabled = false,
  allowTransparent = false,
  headerAction,
}: PerElementColorControlProps) {
  const handleModeToggle = (newMode: 'solid' | 'gradient') => {
    if (newMode !== mode && !disabled) {
      onModeChange(newMode);
    }
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="space-y-2.5">
        <SectionHeader label={label} action={headerAction} />

        <div className="flex gap-1 p-1 bg-[var(--surface-base)] rounded-lg border border-[var(--border-medium)] w-fit">
          <button
            type="button"
            onClick={() => handleModeToggle('solid')}
            disabled={disabled}
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
            disabled={disabled}
            className={`px-3.5 py-2 text-sm rounded-md font-semibold tracking-tight transition-all duration-200 ${
              mode === 'gradient'
                ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Gradient
          </button>
        </div>

        {mode === 'solid' ? (
          <ColorPicker
            label=""
            color={solidColor}
            onChange={onSolidColorChange}
            allowTransparent={allowTransparent}
          />
        ) : (
          <MultiStopGradientPicker
            value={gradient}
            onChange={onGradientChange}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
