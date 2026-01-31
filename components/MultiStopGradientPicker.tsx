'use client';

import ColorPicker from 'react-best-gradient-color-picker';
import { gradientToCSS, parseGradientCSS } from '@/lib/utils/gradient-parser';
import { Gradient } from '@/lib/types/gradient';

interface MultiStopGradientPickerProps {
  value: Gradient | null;
  onChange: (gradient: Gradient | null) => void;
  disabled?: boolean;
}

const DEFAULT_GRADIENT_CSS = 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(255,255,255,1) 100%)';

export function MultiStopGradientPicker({
  value,
  onChange,
  disabled = false,
}: MultiStopGradientPickerProps) {
  // Convert Gradient object to CSS string for the library
  const cssValue = value ? gradientToCSS(value) : DEFAULT_GRADIENT_CSS;

  // Handle changes from the library
  const handleChange = (cssString: string) => {
    const parsed = parseGradientCSS(cssString);
    onChange(parsed);
  };

  if (disabled) {
    return (
      <div className="opacity-50 pointer-events-none">
        <ColorPicker
          value={cssValue}
          onChange={handleChange}
          width={280}
          hidePresets={true}
          hideEyeDrop={true}
        />
      </div>
    );
  }

  return (
    <ColorPicker
      value={cssValue}
      onChange={handleChange}
      width={280}
      hidePresets={true}
      hideEyeDrop={true}
    />
  );
}
