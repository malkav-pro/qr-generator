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
  hidden?: boolean;
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
  hidden = false,
  allowTransparent = false,
  headerAction,
}: PerElementColorControlProps) {
  const isTransparent = allowTransparent && solidColor === 'transparent';

  const handleTransparentToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onModeChange('solid');
      onSolidColorChange('transparent');
    } else {
      onSolidColorChange('#ffffff');
    }
  };

  const transparentCheckbox = allowTransparent ? (
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
  ) : undefined;

  const combinedAction = (headerAction || transparentCheckbox) ? (
    <div className="flex items-center gap-3">
      {headerAction}
      {transparentCheckbox}
    </div>
  ) : undefined;

  return (
    <div className="space-y-2.5">
      <SectionHeader label={label} action={combinedAction} />

      {!hidden && !isTransparent && (
        <>
          <div className="flex gap-1 p-1 bg-[var(--surface-base)] rounded-lg border border-[var(--border-medium)] w-fit">
            <button
              type="button"
              onClick={() => onModeChange('solid')}
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
              onClick={() => onModeChange('gradient')}
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
            />
          ) : (
            <MultiStopGradientPicker
              value={gradient}
              onChange={onGradientChange}
            />
          )}
        </>
      )}
    </div>
  );
}
