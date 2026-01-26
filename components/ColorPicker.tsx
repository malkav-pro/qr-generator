import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow user to type # or not
    const normalized = value.startsWith('#') ? value : `#${value}`;
    onChange(normalized);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      <div className="space-y-3">
        <HexColorPicker color={color} onChange={onChange} />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={color}
            onChange={handleHexInput}
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={7}
          />
          <div
            className="w-12 h-10 rounded-md border-2 border-gray-300"
            style={{ backgroundColor: color }}
            aria-label={`${label} color swatch`}
          />
        </div>
      </div>
    </div>
  );
}
