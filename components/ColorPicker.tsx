'use client';

import { useState } from 'react';
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
  const [showPicker, setShowPicker] = useState(false);
  const isTransparent = color === 'transparent';
  const displayColor = isTransparent ? '#ffffff' : color;
  const isValid = isTransparent || isValidHex(color);

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Add # if not present and user is typing
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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Transparent option for background */}
      {allowTransparent && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isTransparent}
            onChange={handleTransparentToggle}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Transparent</span>
        </label>
      )}

      {/* Color input row */}
      {!isTransparent && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={color}
            onChange={handleHexInput}
            placeholder="#000000"
            className={`flex-1 px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isValid ? 'border-gray-300' : 'border-red-400 bg-red-50'
            }`}
            maxLength={7}
          />
          <div
            className="w-10 h-10 rounded-md border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
            style={{ backgroundColor: isValid ? color : '#fff' }}
            onClick={() => setShowPicker(!showPicker)}
            title="Click to toggle color picker"
            aria-label={`${label} color swatch - click to ${showPicker ? 'hide' : 'show'} picker`}
          />
        </div>
      )}

      {/* Validation hint */}
      {!isTransparent && !isValid && (
        <p className="text-xs text-red-600">
          Enter a valid hex color (e.g., #FF0000 or #F00)
        </p>
      )}

      {/* Expandable color picker */}
      {showPicker && !isTransparent && (
        <div className="pt-2">
          <HexColorPicker color={displayColor} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
