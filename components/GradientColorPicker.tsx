'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import GradientPicker from 'react-best-gradient-color-picker';

interface GradientColorPickerProps {
  label: string;
  solidColor: string;                    // Hex color for solid mode
  gradientCSS: string;                   // CSS gradient string for gradient mode
  mode: 'solid' | 'gradient';            // Current mode
  onSolidChange: (color: string) => void;
  onGradientChange: (css: string) => void;
  onModeChange: (mode: 'solid' | 'gradient') => void;
}

function isValidHex(value: string): boolean {
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value);
}

export function GradientColorPicker({
  label,
  solidColor,
  gradientCSS,
  mode,
  onSolidChange,
  onGradientChange,
  onModeChange,
}: GradientColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

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

  const isValidSolid = isValidHex(solidColor);

  // Generate preview style based on mode
  const previewStyle: React.CSSProperties = mode === 'solid' 
    ? { backgroundColor: isValidSolid ? solidColor : '#fff' }
    : { background: gradientCSS };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Mode toggle buttons */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-md w-fit">
        <button
          type="button"
          onClick={() => handleModeToggle('solid')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
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
          className={`px-3 py-1 text-sm rounded transition-colors ${
            mode === 'gradient'
              ? 'bg-white text-gray-900 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Gradient
        </button>
      </div>

      {/* Solid color mode */}
      {mode === 'solid' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={solidColor}
              onChange={handleHexInput}
              placeholder="#000000"
              className={`flex-1 px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValidSolid ? 'border-gray-300' : 'border-red-400 bg-red-50'
              }`}
              maxLength={7}
            />
            <div
              className="w-10 h-10 rounded-md border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors"
              style={previewStyle}
              onClick={() => setShowPicker(!showPicker)}
              title="Click to toggle color picker"
              aria-label={`${label} color swatch - click to ${showPicker ? 'hide' : 'show'} picker`}
            />
          </div>

          {!isValidSolid && (
            <p className="text-xs text-red-600">
              Enter a valid hex color (e.g., #FF0000 or #F00)
            </p>
          )}

          {showPicker && (
            <div className="pt-2">
              <HexColorPicker color={solidColor} onChange={onSolidChange} />
            </div>
          )}
        </div>
      )}

      {/* Gradient mode */}
      {mode === 'gradient' && (
        <div className="space-y-2">
          {/* Preview swatch */}
          <div
            className="w-full h-10 rounded-md border-2 border-gray-300"
            style={previewStyle}
            aria-label={`${label} gradient preview`}
          />

          {/* Gradient picker */}
          <div className="pt-2">
            <GradientPicker
              value={gradientCSS}
              onChange={onGradientChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
