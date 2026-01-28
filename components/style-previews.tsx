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

      case 'dot':
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

      case 'diamond':
        return (
          <g key={`${cx}-${cy}`} transform={`translate(${cx}, ${cy}) rotate(45)`}>
            <rect x={-r} y={-r} width={r * 2} height={r * 2} fill={color} />
          </g>
        );

      case 'heart':
        return (
          <path
            key={`${cx}-${cy}`}
            d={`M ${cx} ${cy + r * 0.8}
                L ${cx - r * 0.8} ${cy - r * 0.3}
                Q ${cx - r * 0.8} ${cy - r} ${cx - r * 0.3} ${cy - r}
                Q ${cx} ${cy - r} ${cx} ${cy - r * 0.3}
                Q ${cx} ${cy - r} ${cx + r * 0.3} ${cy - r}
                Q ${cx + r * 0.8} ${cy - r} ${cx + r * 0.8} ${cy - r * 0.3}
                L ${cx} ${cy + r * 0.8} Z`}
            fill={color}
          />
        );

      case 'star':
        return (
          <polygon
            key={`${cx}-${cy}`}
            points={`${cx},${cy - r} ${cx + r * 0.3},${cy - r * 0.3} ${cx + r},${cy - r * 0.3} ${cx + r * 0.5},${cy + r * 0.2} ${cx + r * 0.6},${cy + r} ${cx},${cy + r * 0.5} ${cx - r * 0.6},${cy + r} ${cx - r * 0.5},${cy + r * 0.2} ${cx - r},${cy - r * 0.3} ${cx - r * 0.3},${cy - r * 0.3}`}
            fill={color}
          />
        );

      case 'hexagon':
        return (
          <polygon
            key={`${cx}-${cy}`}
            points={`${cx},${cy - r} ${cx + r * 0.87},${cy - r * 0.5} ${cx + r * 0.87},${cy + r * 0.5} ${cx},${cy + r} ${cx - r * 0.87},${cy + r * 0.5} ${cx - r * 0.87},${cy - r * 0.5}`}
            fill={color}
          />
        );

      case 'pentagon':
        return (
          <polygon
            key={`${cx}-${cy}`}
            points={`${cx},${cy - r} ${cx + r * 0.95},${cy - r * 0.31} ${cx + r * 0.59},${cy + r * 0.81} ${cx - r * 0.59},${cy + r * 0.81} ${cx - r * 0.95},${cy - r * 0.31}`}
            fill={color}
          />
        );

      default:
        // For all other styles (lines, wave, weave, zebra, blocks, etc.), show a generic representation
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

      case 'inpoint':
        // Square with inward pointing corners
        return (
          <path
            d={`M ${offset + 5},${offset}
                L ${offset + size - 5},${offset}
                L ${offset + size},${offset + 5}
                L ${offset + size},${offset + size - 5}
                L ${offset + size - 5},${offset + size}
                L ${offset + 5},${offset + size}
                L ${offset},${offset + size - 5}
                L ${offset},${offset + 5}
                Z`}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
          />
        );

      case 'outpoint':
        // Square with outward pointing corners
        return (
          <path
            d={`M ${offset},${offset + 3}
                L ${offset + 3},${offset}
                L ${offset + size - 3},${offset}
                L ${offset + size},${offset + 3}
                L ${offset + size},${offset + size - 3}
                L ${offset + size - 3},${offset + size}
                L ${offset + 3},${offset + size}
                L ${offset},${offset + size - 3}
                Z`}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
          />
        );

      case 'center-circle':
        // Square with circle in center
        return (
          <g>
            <rect
              x={offset}
              y={offset}
              width={size}
              height={size}
              fill="none"
              stroke={color}
              strokeWidth={strokeW}
            />
            <circle
              cx={offset + size / 2}
              cy={offset + size / 2}
              r={4}
              fill={color}
            />
          </g>
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

      case 'heart':
        return (
          <path
            d={`M ${center} ${center + half * 0.6}
                L ${center - half * 0.8} ${center - half * 0.2}
                Q ${center - half * 0.8} ${center - half * 0.8} ${center - half * 0.3} ${center - half * 0.8}
                Q ${center} ${center - half * 0.8} ${center} ${center - half * 0.3}
                Q ${center} ${center - half * 0.8} ${center + half * 0.3} ${center - half * 0.8}
                Q ${center + half * 0.8} ${center - half * 0.8} ${center + half * 0.8} ${center - half * 0.2}
                L ${center} ${center + half * 0.6} Z`}
            fill={color}
          />
        );

      case 'star':
        return (
          <polygon
            points={`${center},${center - half} ${center + half * 0.3},${center - half * 0.3} ${center + half},${center - half * 0.3} ${center + half * 0.5},${center + half * 0.2} ${center + half * 0.6},${center + half} ${center},${center + half * 0.5} ${center - half * 0.6},${center + half} ${center - half * 0.5},${center + half * 0.2} ${center - half},${center - half * 0.3} ${center - half * 0.3},${center - half * 0.3}`}
            fill={color}
          />
        );

      case 'hexagon':
        return (
          <polygon
            points={`${center},${center - half} ${center + half * 0.87},${center - half * 0.5} ${center + half * 0.87},${center + half * 0.5} ${center},${center + half} ${center - half * 0.87},${center + half * 0.5} ${center - half * 0.87},${center - half * 0.5}`}
            fill={color}
          />
        );

      case 'pentagon':
        return (
          <polygon
            points={`${center},${center - half} ${center + half * 0.95},${center - half * 0.31} ${center + half * 0.59},${center + half * 0.81} ${center - half * 0.59},${center + half * 0.81} ${center - half * 0.95},${center - half * 0.31}`}
            fill={color}
          />
        );

      case 'diamond':
        return (
          <g transform={`translate(${center}, ${center}) rotate(45)`}>
            <rect x={-half} y={-half} width={size} height={size} fill={color} />
          </g>
        );

      case 'inpoint':
        return (
          <path
            d={`M ${center - half + 3},${center - half}
                L ${center + half - 3},${center - half}
                L ${center + half},${center - half + 3}
                L ${center + half},${center + half - 3}
                L ${center + half - 3},${center + half}
                L ${center - half + 3},${center + half}
                L ${center - half},${center + half - 3}
                L ${center - half},${center - half + 3}
                Z`}
            fill={color}
          />
        );

      case 'outpoint':
        return (
          <path
            d={`M ${center - half},${center - half + 2}
                L ${center - half + 2},${center - half}
                L ${center + half - 2},${center - half}
                L ${center + half},${center - half + 2}
                L ${center + half},${center + half - 2}
                L ${center + half - 2},${center + half}
                L ${center - half + 2},${center + half}
                L ${center - half},${center + half - 2}
                Z`}
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
