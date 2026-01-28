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
  const size = 20;
  const offset = 6;
  const strokeW = 3;

  const renderCornerSquare = () => {
    switch (style as CornerSquareType) {
      case 'square':
        // Sharp corners
        return (
          <rect
            x={offset}
            y={offset}
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
          />
        );

      case 'dot':
        // Perfect circle
        return (
          <circle
            cx={offset + size / 2}
            cy={offset + size / 2}
            r={size / 2}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
          />
        );

      case 'dots':
        // Small circular dots in corners
        return (
          <g>
            <circle cx={offset + 2} cy={offset + 2} r={2} fill={color} />
            <circle cx={offset + size - 2} cy={offset + 2} r={2} fill={color} />
            <circle cx={offset + 2} cy={offset + size - 2} r={2} fill={color} />
            <circle cx={offset + size - 2} cy={offset + size - 2} r={2} fill={color} />
          </g>
        );

      case 'rounded':
        // Slightly rounded corners
        return (
          <rect
            x={offset}
            y={offset}
            width={size}
            height={size}
            rx={2.5}
            ry={2.5}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
          />
        );

      case 'classy':
        // Square with rounded inner corners
        return (
          <path
            d={`M ${offset},${offset + 3} 
                Q ${offset},${offset} ${offset + 3},${offset}
                L ${offset + size - 3},${offset}
                Q ${offset + size},${offset} ${offset + size},${offset + 3}
                L ${offset + size},${offset + size - 3}
                Q ${offset + size},${offset + size} ${offset + size - 3},${offset + size}
                L ${offset + 3},${offset + size}
                Q ${offset},${offset + size} ${offset},${offset + size - 3}
                Z`}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
          />
        );

      case 'classy-rounded':
        // Rounded square with extra rounded inner corners
        return (
          <rect
            x={offset}
            y={offset}
            width={size}
            height={size}
            rx={4}
            ry={4}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
          />
        );

      case 'extra-rounded':
        // Very rounded corners
        return (
          <rect
            x={offset}
            y={offset}
            width={size}
            height={size}
            rx={6}
            ry={6}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
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
            strokeWidth={strokeW}
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
    const size = 14;
    const center = 16;
    const half = size / 2;

    switch (style as CornerDotType) {
      case 'square':
        // Sharp square
        return (
          <rect
            x={center - half}
            y={center - half}
            width={size}
            height={size}
            fill={color}
          />
        );

      case 'dot':
        // Perfect circle
        return (
          <circle
            cx={center}
            cy={center}
            r={half}
            fill={color}
          />
        );

      case 'dots':
        // Grid of small dots
        return (
          <g>
            <circle cx={center - 4} cy={center - 4} r={1.5} fill={color} />
            <circle cx={center} cy={center - 4} r={1.5} fill={color} />
            <circle cx={center + 4} cy={center - 4} r={1.5} fill={color} />
            <circle cx={center - 4} cy={center} r={1.5} fill={color} />
            <circle cx={center} cy={center} r={1.5} fill={color} />
            <circle cx={center + 4} cy={center} r={1.5} fill={color} />
            <circle cx={center - 4} cy={center + 4} r={1.5} fill={color} />
            <circle cx={center} cy={center + 4} r={1.5} fill={color} />
            <circle cx={center + 4} cy={center + 4} r={1.5} fill={color} />
          </g>
        );

      case 'rounded':
        // Slightly rounded square
        return (
          <rect
            x={center - half}
            y={center - half}
            width={size}
            height={size}
            rx={2}
            ry={2}
            fill={color}
          />
        );

      case 'classy':
        // Square with rounded inner corners
        return (
          <path
            d={`M ${center - half},${center - half + 2} 
                Q ${center - half},${center - half} ${center - half + 2},${center - half}
                L ${center + half - 2},${center - half}
                Q ${center + half},${center - half} ${center + half},${center - half + 2}
                L ${center + half},${center + half - 2}
                Q ${center + half},${center + half} ${center + half - 2},${center + half}
                L ${center - half + 2},${center + half}
                Q ${center - half},${center + half} ${center - half},${center + half - 2}
                Z`}
            fill={color}
          />
        );

      case 'classy-rounded':
        // More rounded square
        return (
          <rect
            x={center - half}
            y={center - half}
            width={size}
            height={size}
            rx={3.5}
            ry={3.5}
            fill={color}
          />
        );

      case 'extra-rounded':
        // Almost circular, very rounded
        return (
          <rect
            x={center - half}
            y={center - half}
            width={size}
            height={size}
            rx={5}
            ry={5}
            fill={color}
          />
        );

      default:
        return (
          <rect
            x={center - half}
            y={center - half}
            width={size}
            height={size}
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
