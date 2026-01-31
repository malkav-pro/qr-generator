'use client';

import { GradientEditor } from './GradientEditor';
import { Gradient } from '@/lib/types/gradient';

interface MultiStopGradientPickerProps {
  value: Gradient | null;
  onChange: (gradient: Gradient | null) => void;
  disabled?: boolean;
}

export function MultiStopGradientPicker({
  value,
  onChange,
  disabled = false,
}: MultiStopGradientPickerProps) {
  return (
    <GradientEditor
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
