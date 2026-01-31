'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { Popover } from '@headlessui/react';
import { HexAlphaColorPicker } from 'react-colorful';
import { Gradient, GradientColorStop, GradientType } from '@/lib/types/gradient';

interface GradientEditorProps {
  value: Gradient | null;
  onChange: (gradient: Gradient | null) => void;
  disabled?: boolean;
}

const DEFAULT_GRADIENT: Gradient = {
  type: 'linear',
  rotation: Math.PI / 2,
  colorStops: [
    { offset: 0, color: '#000000FF' },
    { offset: 1, color: '#FFFFFFFF' },
  ],
};

function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0, a: 255 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: result[4] ? parseInt(result[4], 16) : 255,
  };
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  return `#${[r, g, b, a].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function getStopColorHex(color: string): string {
  return color.substring(0, 7);
}

function getStopOpacity(color: string): number {
  if (color.length !== 9) return 100;
  const alpha = parseInt(color.substring(7, 9), 16);
  return Math.round((alpha / 255) * 100);
}

function stopToRgbaString(color: string): string {
  // Return full 8-char hex with alpha
  if (color.length === 9) return color;
  return color + 'FF';
}

function parseRgbaInput(input: string): { r: number; g: number; b: number; a: number } | null {
  // Accept #RRGGBB, #RRGGBBAA, or rgba(r,g,b,a)
  const hex8 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(input);
  if (hex8) {
    return {
      r: parseInt(hex8[1], 16),
      g: parseInt(hex8[2], 16),
      b: parseInt(hex8[3], 16),
      a: parseInt(hex8[4], 16),
    };
  }
  const hex6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(input);
  if (hex6) {
    return {
      r: parseInt(hex6[1], 16),
      g: parseInt(hex6[2], 16),
      b: parseInt(hex6[3], 16),
      a: 255,
    };
  }
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(input);
  if (rgba) {
    return {
      r: Math.min(255, parseInt(rgba[1])),
      g: Math.min(255, parseInt(rgba[2])),
      b: Math.min(255, parseInt(rgba[3])),
      a: rgba[4] !== undefined ? Math.round(Math.min(1, parseFloat(rgba[4])) * 255) : 255,
    };
  }
  return null;
}

function buildGradientCSS(gradient: Gradient): string {
  const stops = gradient.colorStops
    .map(stop => {
      const rgba = hexToRgba(stop.color);
      return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a / 255}) ${(stop.offset * 100).toFixed(1)}%`;
    })
    .join(', ');

  if (gradient.type === 'radial') {
    return `radial-gradient(circle, ${stops})`;
  }

  const degrees = Math.round((gradient.rotation ?? 0) * (180 / Math.PI));
  return `linear-gradient(${degrees}deg, ${stops})`;
}

export function GradientEditor({ value, onChange, disabled = false }: GradientEditorProps) {
  const gradient = value ?? DEFAULT_GRADIENT;
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const sortedStops = useMemo(() => {
    return [...gradient.colorStops].sort((a, b) => a.offset - b.offset);
  }, [gradient.colorStops]);

  const selectedStop = sortedStops[selectedStopIndex];

  const updateGradient = useCallback(
    (updates: Partial<Gradient>) => {
      onChange({ ...gradient, ...updates });
    },
    [gradient, onChange]
  );

  const updateStop = useCallback(
    (index: number, updates: Partial<GradientColorStop>) => {
      const newStops = [...sortedStops];
      newStops[index] = { ...newStops[index], ...updates };
      updateGradient({ colorStops: newStops });
    },
    [sortedStops, updateGradient]
  );

  const handleBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || isDragging) return;
      const rect = barRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = e.clientX - rect.left;
      const offset = Math.max(0, Math.min(1, clickX / rect.width));

      const newStop: GradientColorStop = {
        offset,
        color: interpolateColor(sortedStops, offset),
      };

      const newStops = [...sortedStops, newStop].sort((a, b) => a.offset - b.offset);
      const newIndex = newStops.findIndex(s => s.offset === offset);

      updateGradient({ colorStops: newStops });
      setSelectedStopIndex(newIndex);
    },
    [disabled, isDragging, sortedStops, updateGradient]
  );

  const handleStopDrag = useCallback(
    (index: number, clientX: number) => {
      const rect = barRef.current?.getBoundingClientRect();
      if (!rect) return;

      const offset = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      updateStop(index, { offset });
    },
    [updateStop]
  );

  const handleStopDoubleClick = useCallback(
    (index: number) => {
      if (sortedStops.length <= 2) return;
      const newStops = sortedStops.filter((_, i) => i !== index);
      updateGradient({ colorStops: newStops });
      setSelectedStopIndex(Math.max(0, Math.min(index, newStops.length - 1)));
    },
    [sortedStops, updateGradient]
  );

  const handleFullColorChange = useCallback(
    (hexAlpha: string) => {
      // HexAlphaColorPicker returns #rrggbbaa
      updateStop(selectedStopIndex, { color: hexAlpha.toUpperCase() });
    },
    [selectedStopIndex, updateStop]
  );

  const handleRgbaInput = useCallback(
    (input: string) => {
      const parsed = parseRgbaInput(input);
      if (parsed) {
        updateStop(selectedStopIndex, { color: rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a) });
      }
    },
    [selectedStopIndex, updateStop]
  );

  const handleTypeChange = useCallback(
    (type: GradientType) => {
      updateGradient({ type });
    },
    [updateGradient]
  );

  const handleRotationChange = useCallback(
    (degrees: number) => {
      updateGradient({ rotation: (degrees * Math.PI) / 180 });
    },
    [updateGradient]
  );

  const gradientCSS = buildGradientCSS(gradient);
  const rotationDegrees = Math.round(((gradient.rotation ?? 0) * 180) / Math.PI);

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="space-y-3">
        <div className="flex gap-1 p-1 bg-[var(--surface-base)] rounded-lg border border-[var(--border-medium)] w-fit">
          <button
            type="button"
            onClick={() => handleTypeChange('linear')}
            className={`px-3 py-1.5 text-xs rounded-md font-semibold tracking-tight transition-all duration-200 ${
              gradient.type === 'linear'
                ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Linear
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('radial')}
            className={`px-3 py-1.5 text-xs rounded-md font-semibold tracking-tight transition-all duration-200 ${
              gradient.type === 'radial'
                ? 'bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Radial
          </button>
        </div>

        {gradient.type === 'linear' && (
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Angle
            </label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="range"
                min="0"
                max="360"
                value={rotationDegrees}
                onChange={e => handleRotationChange(parseInt(e.target.value))}
                className="flex-1 h-1.5 bg-[var(--surface-elevated)] rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-start)]
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-[var(--accent-start)] [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="360"
                value={rotationDegrees}
                onChange={e => handleRotationChange(parseInt(e.target.value))}
                className="w-16 px-2 py-1 text-xs font-mono text-center border rounded
                  border-[var(--border-medium)] bg-[var(--surface-elevated)]
                  focus:border-[var(--accent-start)] focus:outline-none"
              />
              <span className="text-xs text-[var(--text-muted)] font-medium">°</span>
            </div>
          </div>
        )}

        {/* Gradient bar with markers below */}
        <div className="relative mb-6">
          <div
            ref={barRef}
            onClick={handleBarClick}
            className="relative h-8 rounded-lg border-2 border-[var(--border-medium)] cursor-crosshair overflow-hidden
              hover:border-[var(--border-strong)] transition-all duration-200"
            style={{
              background: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='%23333'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23333'/%3E%3Crect x='10' width='10' height='10' fill='%23666'/%3E%3Crect y='10' width='10' height='10' fill='%23666'/%3E%3C/svg%3E")`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: gradientCSS }}
            />
          </div>

          {/* Stop markers below the bar */}
          {sortedStops.map((stop, index) => (
            <GradientStopMarker
              key={index}
              stop={stop}
              isSelected={index === selectedStopIndex}
              onSelect={() => setSelectedStopIndex(index)}
              onDrag={clientX => handleStopDrag(index, clientX)}
              onDoubleClick={() => handleStopDoubleClick(index)}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
          ))}
        </div>

        <div className="text-[10px] text-[var(--text-muted)] font-medium">
          Click bar to add • Drag to move • Double-click to remove
        </div>

        {selectedStop && (
          <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={stopToRgbaString(selectedStop.color)}
                onChange={e => handleRgbaInput(e.target.value)}
                className="flex-1 px-2.5 py-1.5 border rounded-lg font-mono text-xs
                  border-[var(--border-medium)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]
                  focus:outline-none focus:border-[var(--accent-start)] focus:shadow-[0_0_0_3px_var(--accent-glow)]"
                placeholder="#RRGGBBAA"
              />
              <Popover className="relative">
                <Popover.Button
                  className="w-9 h-9 rounded-lg border-2 cursor-pointer transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)]
                    hover:scale-105"
                  style={{
                    backgroundColor: selectedStop.color,
                    borderColor: 'var(--border-strong)',
                  }}
                />
                <Popover.Panel
                  className="absolute z-[100] mt-2 right-0 bg-[var(--surface-elevated)] rounded-xl border border-[var(--border-strong)] p-4"
                  style={{ boxShadow: 'var(--shadow-lg)' }}
                >
                  <HexAlphaColorPicker
                    color={stopToRgbaString(selectedStop.color)}
                    onChange={handleFullColorChange}
                  />
                </Popover.Panel>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] min-w-[60px]">
                Position
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(selectedStop.offset * 100)}
                onChange={e => updateStop(selectedStopIndex, { offset: parseInt(e.target.value) / 100 })}
                className="flex-1 h-1.5 bg-[var(--surface-elevated)] rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-start)]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-[var(--accent-start)] [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer"
              />
              <span className="text-xs text-[var(--text-secondary)] font-mono min-w-[42px] text-right">
                {Math.round(selectedStop.offset * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GradientStopMarker({
  stop,
  isSelected,
  onSelect,
  onDrag,
  onDoubleClick,
  onDragStart,
  onDragEnd,
}: {
  stop: GradientColorStop;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (clientX: number) => void;
  onDoubleClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();
      onDragStart();

      const handleMouseMove = (moveEvent: MouseEvent) => {
        onDrag(moveEvent.clientX);
      };

      const handleMouseUp = () => {
        onDragEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onSelect, onDrag, onDragStart, onDragEnd]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDoubleClick();
    },
    [onDoubleClick]
  );

  return (
    <div
      className="absolute top-full mt-1 -translate-x-1/2 cursor-grab active:cursor-grabbing"
      style={{ left: `${stop.offset * 100}%` }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Triangle pointing up */}
      <div className="mx-auto w-0 h-0
        border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent
        border-b-[5px]"
        style={{ borderBottomColor: isSelected ? 'var(--accent-start)' : 'var(--border-strong)' }}
      />
      {/* Color circle */}
      <div
        className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
          isSelected
            ? 'border-[var(--accent-start)] scale-110'
            : 'border-[var(--border-strong)] hover:border-[var(--accent-start)] hover:scale-105'
        }`}
        style={{
          backgroundColor: getStopColorHex(stop.color),
          boxShadow: isSelected
            ? '0 0 0 2px var(--accent-glow), 0 2px 8px rgba(0,0,0,0.3)'
            : '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

function interpolateColor(stops: GradientColorStop[], offset: number): string {
  const sorted = [...stops].sort((a, b) => a.offset - b.offset);

  if (offset <= sorted[0].offset) return sorted[0].color;
  if (offset >= sorted[sorted.length - 1].offset) return sorted[sorted.length - 1].color;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (offset >= sorted[i].offset && offset <= sorted[i + 1].offset) {
      const range = sorted[i + 1].offset - sorted[i].offset;
      const t = (offset - sorted[i].offset) / range;

      const c1 = hexToRgba(sorted[i].color);
      const c2 = hexToRgba(sorted[i + 1].color);

      return rgbaToHex(
        Math.round(c1.r + (c2.r - c1.r) * t),
        Math.round(c1.g + (c2.g - c1.g) * t),
        Math.round(c1.b + (c2.b - c1.b) * t),
        Math.round(c1.a + (c2.a - c1.a) * t)
      );
    }
  }

  return sorted[0].color;
}
