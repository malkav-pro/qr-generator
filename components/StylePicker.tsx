import type { DotType, CornerSquareType, CornerDotType } from '@/lib/types';
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-500'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center justify-center">
                {renderPreview(option.value)}
              </div>
              <span className="text-xs font-medium text-gray-700">
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
