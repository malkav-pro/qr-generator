import type { DotType, CornerSquareType, CornerDotType, ShapeType } from '@/lib/types';
import { DOT_STYLES, CORNER_SQUARE_STYLES, CORNER_DOT_STYLES } from '@/lib/constants/qr-styles';
import { DotStylePreview, CornerSquarePreview, CornerDotPreview } from './style-previews';

interface StyleOption<T> {
  value: T;
  label: string;
}

interface StylePickerProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: StyleOption<T>[];
  renderPreview: (style: T) => React.ReactNode;
  label: string;
}

/**
 * Generic style picker component with visual preview grid
 * Displays a grid of buttons with preview thumbnails and labels
 */
function StylePicker<T extends string>({
  value,
  onChange,
  options,
  renderPreview,
  label,
}: StylePickerProps<T>) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2.5">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                relative flex flex-col items-center gap-2.5 p-3.5 rounded-lg border-2 transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
                hover:scale-[1.02] active:scale-[0.98]
                ${isSelected
                  ? 'border-[var(--accent-start)] bg-[var(--accent-glow)] shadow-[0_0_16px_var(--accent-glow)]'
                  : 'border-[var(--border-medium)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)]'
                }
              `}
            >
              <div className="flex items-center justify-center">
                {renderPreview(option.value)}
              </div>
              <span className={`text-xs font-semibold tracking-tight ${
                isSelected ? 'text-[var(--accent-start)]' : 'text-[var(--text-secondary)]'
              }`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Dot style picker with visual previews
 */
export function DotStylePicker({
  value,
  onChange,
}: {
  value: DotType;
  onChange: (value: DotType) => void;
}) {
  return (
    <StylePicker
      value={value}
      onChange={onChange}
      options={DOT_STYLES}
      renderPreview={(style) => <DotStylePreview style={style} />}
      label="Dot Style"
    />
  );
}

/**
 * Corner square style picker with visual previews
 */
export function CornerSquareStylePicker({
  value,
  onChange,
}: {
  value: CornerSquareType;
  onChange: (value: CornerSquareType) => void;
}) {
  return (
    <StylePicker
      value={value}
      onChange={onChange}
      options={CORNER_SQUARE_STYLES}
      renderPreview={(style) => <CornerSquarePreview style={style} />}
      label="Corner Square Style"
    />
  );
}

/**
 * Corner dot style picker with visual previews
 */
export function CornerDotStylePicker({
  value,
  onChange,
}: {
  value: CornerDotType;
  onChange: (value: CornerDotType) => void;
}) {
  return (
    <StylePicker
      value={value}
      onChange={onChange}
      options={CORNER_DOT_STYLES}
      renderPreview={(style) => <CornerDotPreview style={style} />}
      label="Corner Dot Style"
    />
  );
}

/**
 * QR code shape picker — square or circle toggle
 */
export function ShapePicker({
  value,
  onChange,
}: {
  value: ShapeType;
  onChange: (value: ShapeType) => void;
}) {
  const options: { value: ShapeType; label: string }[] = [
    { value: 'square', label: 'Square' },
    { value: 'circle', label: 'Circle' },
  ];

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
        Shape
      </label>
      <div className="flex gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex items-center gap-2.5 px-4 py-3 rounded-lg border-2 transition-all duration-300 flex-1
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
                hover:scale-[1.02] active:scale-[0.98]
                ${isSelected
                  ? 'border-[var(--accent-start)] bg-[var(--accent-glow)] shadow-[0_0_16px_var(--accent-glow)]'
                  : 'border-[var(--border-medium)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)]'
                }
              `}
            >
              <div className={`w-5 h-5 border-2 ${
                isSelected ? 'border-[var(--accent-start)]' : 'border-[var(--text-secondary)]'
              } ${option.value === 'circle' ? 'rounded-full' : 'rounded-sm'}`} />
              <span className={`text-xs font-semibold tracking-tight ${
                isSelected ? 'text-[var(--accent-start)]' : 'text-[var(--text-secondary)]'
              }`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
