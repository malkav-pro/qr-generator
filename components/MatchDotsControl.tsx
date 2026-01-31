'use client';

import { PerElementColorControl } from './PerElementColorControl';
import { Gradient } from '@/lib/types/gradient';

interface MatchDotsControlProps {
  label: string;
  matchDots: boolean;
  onMatchDotsChange: (match: boolean) => void;
  dotsMode: 'solid' | 'gradient';
  dotsSolidColor: string;
  dotsGradient: Gradient | null;
  mode: 'solid' | 'gradient';
  solidColor: string;
  gradient: Gradient | null;
  onModeChange: (mode: 'solid' | 'gradient') => void;
  onSolidColorChange: (color: string) => void;
  onGradientChange: (gradient: Gradient | null) => void;
}

export function MatchDotsControl({
  label,
  matchDots,
  onMatchDotsChange,
  dotsMode,
  dotsSolidColor,
  dotsGradient,
  mode,
  solidColor,
  gradient,
  onModeChange,
  onSolidColorChange,
  onGradientChange,
}: MatchDotsControlProps) {
  const handleCheckboxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMatchDotsChange(e.target.checked);
  };

  const displayMode = matchDots ? dotsMode : mode;
  const displaySolidColor = matchDots ? dotsSolidColor : solidColor;
  const displayGradient = matchDots ? dotsGradient : gradient;

  const checkboxAction = (
    <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={matchDots}
          onChange={handleCheckboxToggle}
          className="sr-only peer"
        />
        <div
          className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center
            ${
              matchDots
                ? 'bg-[var(--accent-start)] border-[var(--accent-start)]'
                : 'bg-[var(--surface-base)] border-[var(--border-strong)] group-hover:border-[var(--accent-start)]'
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-start)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--surface-raised)]`}
        >
          {matchDots && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="font-medium group-hover:text-[var(--accent-start)] transition-colors duration-200">
        Match dots
      </span>
    </label>
  );

  return (
    <PerElementColorControl
      label={label}
      mode={displayMode}
      solidColor={displaySolidColor}
      gradient={displayGradient}
      onModeChange={onModeChange}
      onSolidColorChange={onSolidColorChange}
      onGradientChange={onGradientChange}
      hidden={matchDots}
      headerAction={checkboxAction}
    />
  );
}
