import { CornerSquareType, CornerDotType, DotType } from '@liquid-js/qr-code-styling';

interface CornerSquarePreviewProps {
  style: `${CornerSquareType | DotType}`;
}

interface CornerDotPreviewProps {
  style: `${CornerDotType | DotType}`;
}

/**
 * Hand-crafted SVG previews for corner square styles
 * Shows a single corner finder pattern outer square
 */
export function CornerSquarePreview({ style }: CornerSquarePreviewProps) {
  const color = 'currentColor';
  const size = 20;
  const offset = 6;
  const strokeW = 3;

  const renderSquare = () => {
    switch (style) {
      case CornerSquareType.square:
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

      case CornerSquareType.dot:
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

      case CornerSquareType.extraRounded:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H9.42858C5.87816 3 3 5.87816 3 9.42858v5.14284C3 18.12184 5.87816 21 9.42858 21h5.14284C18.12184 21 21 18.12184 21 14.57142V9.42858C21 5.87816 18.12184 3 14.57142 3m3.85716 11.57142c0 2.13025-1.7269 3.85716-3.85716 3.85716H9.42858c-2.13025 0-3.85716-1.7269-3.85716-3.85716V9.42858c0-2.13025 1.7269-3.85716 3.85716-3.85716h5.14284c2.13025 0 3.85716 1.7269 3.85716 3.85716z"></path>
          </svg>
        );

      case CornerSquareType.classy:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H3v11.57142C3 18.12184 5.87816 21 9.42858 21H21V9.42858C21 5.87816 18.12184 3 14.57142 3m3.85716 15.42858h-9c-2.13025 0-3.85716-1.7269-3.85716-3.85716v-9h9c2.13025 0 3.85716 1.7269 3.85716 3.85716z"></path>
          </svg>
        );

      case CornerSquareType.inpoint:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H9.42858C5.87816 3 3 5.87816 3 9.42858v5.14284C3 18.12184 5.87816 21 9.42858 21H21V9.42858C21 5.87816 18.12184 3 14.57142 3m3.85716 15.42858h-9c-2.13025 0-3.85716-1.7269-3.85716-3.85716V9.42858c0-2.13025 1.7269-3.85716 3.85716-3.85716h5.14284c2.13025 0 3.85716 1.7269 3.85716 3.85716z"></path>
          </svg>
        );

      case CornerSquareType.outpoint:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H3v11.57142C3 18.12184 5.87816 21 9.42858 21h5.14284C18.12184 21 21 18.12184 21 14.57142V9.42858C21 5.87816 18.12184 3 14.57142 3m3.85716 11.57142c0 2.13025-1.7269 3.85716-3.85716 3.85716H9.42858c-2.13025 0-3.85716-1.7269-3.85716-3.85716v-9h9c2.13025 0 3.85716 1.7269 3.85716 3.85716z"></path>
          </svg>
        );

      case CornerSquareType.centerCircle:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M3 21h18V3H3zm9-16.2c3.97645 0 7.2 3.22355 7.2 7.2s-3.22355 7.2-7.2 7.2c-3.97644 0-7.2-3.22355-7.2-7.2S8.02356 4.8 12 4.8"></path>
          </svg>
        );

      // DotType styles used as corner squares
      case DotType.weave:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M9 4.20001H7.79999V3H4.20001v1.20001H3v3.59998h1.20001V9h3.59998V7.79999H9zm10.79999 0V3h-3.59998v1.20001H15v3.59998h1.20001V9h3.59998V7.79999H21V4.20001zm0 10.79999h-3.59998v1.20001h-2.40002v-2.40002H15v-3.59998h-1.20001V9h-3.59998v1.20001H9v3.59998h1.20001v2.40002H9v3.59998h1.20001V21h3.59998v-1.20001h2.40002V21h3.59998v-1.20001H21v-3.59998h-1.20001z"></path>
          </svg>
        );

      case DotType.diamond:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M2.39374 6 6 2.39374 9.60626 6 6 9.60626zm12.00001-.00002L18 2.39374l3.60624 3.60624L18 9.60623zM15 17.39374 12.60626 15l3-3L12 8.39374 8.39374 12l3 3-3 3L12 21.60626l3-3 3 3L21.60626 18 18 14.39374z"></path>
          </svg>
        );

      case DotType.randomDot:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M5.41344 2.97c-1.31635 0-2.38345 1.0671-2.38345 2.38342 0 1.31634 1.0671 2.38345 2.38345 2.38345s2.38344-1.0671 2.38344-2.38345c0-1.31631-1.0671-2.38341-2.38344-2.38341"></path>
            <circle cx="11.95045" cy="11.89047" r="2.92046"></circle>
            <circle cx="11.34382" cy="17.28384" r="2.31383"></circle>
            <circle cx="17.67821" cy="5.61823" r="2.64822"></circle>
            <circle cx="17.93796" cy="17.87797" r="2.90798"></circle>
          </svg>
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
    <svg viewBox="0 0 32 32" className="w-12 h-12">
      {renderSquare()}
    </svg>
  );
}

/**
 * Hand-crafted SVG previews for corner dot styles
 * Shows a single corner finder pattern center dot
 */
export function CornerDotPreview({ style }: CornerDotPreviewProps) {
  const color = 'currentColor';

  const renderDot = () => {
    switch (style) {
      case CornerDotType.square:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        );

      case CornerDotType.dot:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <circle cx="12" cy="12" r="6" />
          </svg>
        );

      case CornerDotType.extraRounded:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H9.42858C5.87816 3 3 5.87816 3 9.42858v5.14284C3 18.12184 5.87816 21 9.42858 21h5.14284C18.12184 21 21 18.12184 21 14.57142V9.42858C21 5.87816 18.12184 3 14.57142 3"></path>
          </svg>
        );

      case CornerDotType.classy:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H3v11.57142C3 18.12184 5.87816 21 9.42858 21H21V9.42858C21 5.87816 18.12184 3 14.57142 3"></path>
          </svg>
        );

      case CornerDotType.heart:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M12 18.5 L 6.5 12 Q 6.5 7 10 7 Q 12 7 12 9.5 Q 12 7 14 7 Q 17.5 7 17.5 12 Z" />
          </svg>
        );

      case CornerDotType.star:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <polygon points="12,5 14,10.5 19.5,10.5 15.5,14 17,19.5 12,16 7,19.5 8.5,14 4.5,10.5 10,10.5" />
          </svg>
        );

      case CornerDotType.pentagon:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <polygon points="12,5 18.7,9.3 16.5,17.7 7.5,17.7 5.3,9.3" />
          </svg>
        );

      case CornerDotType.hexagon:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <polygon points="12,5 18.2,8.5 18.2,15.5 12,19 5.8,15.5 5.8,8.5" />
          </svg>
        );

      case CornerDotType.diamond:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <rect x="7" y="7" width="10" height="10" transform="rotate(45 12 12)" />
          </svg>
        );

      case CornerDotType.inpoint:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H9.42858C5.87816 3 3 5.87816 3 9.42858v5.14284C3 18.12184 5.87816 21 9.42858 21H21V9.42858C21 5.87816 18.12184 3 14.57142 3"></path>
          </svg>
        );

      case CornerDotType.outpoint:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M14.57142 3H3v11.57142C3 18.12184 5.87816 21 9.42858 21h5.14284C18.12184 21 21 18.12184 21 14.57142V9.42858C21 5.87816 18.12184 3 14.57142 3"></path>
          </svg>
        );

      // DotType styles used as corner dots
      case DotType.zebraVertical:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M12 9.6c-1.32546 0-2.4 1.0745-2.4 2.4v6c0 1.32546 1.07454 2.4 2.4 2.4 1.3255 0 2.4-1.07454 2.4-2.4v-6c0-1.3255-1.0745-2.4-2.4-2.4"></path>
            <circle cx="18" cy="18" r="2.4"></circle>
            <circle cx="18" cy="6" r="2.4"></circle>
            <circle cx="6" cy="6" r="2.4"></circle>
          </svg>
        );

      case DotType.zebraHorizontal:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M20.4 18c0 1.32546-1.0745 2.4-2.4 2.4h-6c-1.32546 0-2.4-1.07454-2.4-2.4 0-1.3255 1.07454-2.4 2.4-2.4h6c1.3255 0 2.4 1.0745 2.4 2.4"></path>
            <circle cx="12" cy="12" r="2.4"></circle>
            <circle cx="18" cy="6" r="2.4"></circle>
            <circle cx="6" cy="6" r="2.4"></circle>
          </svg>
        );

      case DotType.blocksVertical:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M3.59998 3.18994h4.80005V9H3.59998zm6 11.81006v5.37628h4.80004V9.19458H9.59998zm6-11.80597h4.80005v4.75952h-4.80005zm0 11.77948h4.80005v4.96759h-4.80005z"></path>
          </svg>
        );

      case DotType.blocksHorizontal:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <path d="M15.28076 3.59998h5.06879v4.79999h-5.06879zm-.28076 12h-4.69104v4.79998h10.22925v-4.79998zm-5.46039-6h5.2312v4.79999h-5.2312zm-5.77826-6H8.5747v4.79999H3.76135z"></path>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-12 h-12">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        );
    }
  };

  return renderDot();
}
