import type { DotType, CornerSquareType, CornerDotType } from '@/lib/types';

interface PreviewProps {
  style: DotType | CornerSquareType | CornerDotType;
  color?: string;
}

/**
 * Visual preview thumbnail for dot styles
 * Shows a 3x3 grid of dots in the specified style
 */
export function DotStylePreview({ style, color = 'currentColor' }: PreviewProps) {
  const renderDot = (cx: number, cy: number) => {
    const r = 3;

    switch (style as DotType) {
      case 'square':
        return <rect key={`${cx}-${cy}`} x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={color} />;

      case 'dots':
        return <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={color} />;

      case 'rounded':
        return <rect key={`${cx}-${cy}`} x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={1} ry={1} fill={color} />;

      case 'classy':
        return (
          <g key={`${cx}-${cy}`}>
            <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={color} />
            <circle cx={cx} cy={cy} r={r * 0.4} fill="white" />
          </g>
        );

      case 'classy-rounded':
        return (
          <g key={`${cx}-${cy}`}>
            <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={1} ry={1} fill={color} />
            <circle cx={cx} cy={cy} r={r * 0.4} fill="white" />
          </g>
        );

      case 'extra-rounded':
        return <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r * 1.2} fill={color} />;

      default:
        return <rect key={`${cx}-${cy}`} x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={color} />;
    }
  };

  const dots = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = 6 + col * 10;
      const cy = 6 + row * 10;
      dots.push(renderDot(cx, cy));
    }
  }

  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8">
      {dots}
    </svg>
  );
}

/**
 * Visual preview thumbnail for corner square styles
 * Shows a single corner finder pattern outer square
 */
export function CornerSquarePreview({ style, color = 'currentColor' }: PreviewProps) {
  const size = 24;
  const offset = 4;

  const renderCornerSquare = () => {
    switch (style as CornerSquareType) {
      case 'square':
        return (
          <rect
            x={offset}
            y={offset}
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth={4}
          />
        );

      case 'dot':
        return (
          <circle
            cx={offset + size / 2}
            cy={offset + size / 2}
            r={size / 2}
            fill="none"
            stroke={color}
            strokeWidth={4}
          />
        );

      case 'extra-rounded':
        return (
          <rect
            x={offset}
            y={offset}
            width={size}
            height={size}
            rx={8}
            ry={8}
            fill="none"
            stroke={color}
            strokeWidth={4}
          />
        );

      default:
        return (
          <rect
            x={offset}
            y={offset}
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth={4}
          />
        );
    }
  };

  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8">
      {renderCornerSquare()}
    </svg>
  );
}

/**
 * Visual preview thumbnail for corner dot styles
 * Shows a single center dot of corner finder pattern
 */
export function CornerDotPreview({ style, color = 'currentColor' }: PreviewProps) {
  const renderCornerDot = () => {
    switch (style as CornerDotType) {
      case 'square':
        return (
          <rect
            x={8}
            y={8}
            width={16}
            height={16}
            fill={color}
          />
        );

      case 'dot':
        return (
          <circle
            cx={16}
            cy={16}
            r={8}
            fill={color}
          />
        );

      default:
        return (
          <rect
            x={8}
            y={8}
            width={16}
            height={16}
            fill={color}
          />
        );
    }
  };

  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8">
      {renderCornerDot()}
    </svg>
  );
}
