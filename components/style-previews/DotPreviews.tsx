import { DotType } from '@liquid-js/qr-code-styling';

interface DotPreviewProps {
  style: `${DotType}`;
}

/**
 * SVG previews for dot styles using official liquid-js icons
 * Extracted from https://qr-code-styling.com/
 */
export function DotStylePreview({ style }: DotPreviewProps) {
  const getSVG = () => {
    switch (style) {
      case DotType.square:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M3 3h6v6H3zm6 6v12h12v-6h-6V9zm6-6h6v6h-6z"></path>
          </svg>
        );

      case DotType.dot:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="12" cy="18" r="3"></circle>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="18" cy="18" r="3"></circle>
          </svg>
        );

      case DotType.randomDot:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M5.41344 2.97c-1.31635 0-2.38345 1.0671-2.38345 2.38342 0 1.31634 1.0671 2.38345 2.38345 2.38345s2.38344-1.0671 2.38344-2.38345c0-1.31631-1.0671-2.38341-2.38344-2.38341"></path>
            <circle cx="11.95045" cy="11.89047" r="2.92046"></circle>
            <circle cx="11.34382" cy="17.28384" r="2.31383"></circle>
            <circle cx="17.67821" cy="5.61823" r="2.64822"></circle>
            <circle cx="17.93796" cy="17.87797" r="2.90798"></circle>
          </svg>
        );

      case DotType.rounded:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="18" cy="6" r="3"></circle>
            <path d="M18 15h-3v-3c0-1.65685-1.34315-3-3-3s-3 1.34315-3 3v6c0 1.65685 1.34315 3 3 3h6c1.65685 0 3-1.34315 3-3s-1.34315-3-3-3"></path>
          </svg>
        );

      case DotType.extraRounded:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="18" cy="6" r="3"></circle>
            <path d="M18 15h-3v-3c0-1.65685-1.34315-3-3-3s-3 1.34315-3 3v3c0 3.3137 2.68627 6 6 6h3c1.65685 0 3-1.34315 3-3s-1.34315-3-3-3"></path>
          </svg>
        );

      case DotType.verticalLine:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <circle cx="6" cy="6" r="3"></circle>
            <path d="M15 12c0-1.65685-1.34315-3-3-3s-3 1.34315-3 3v6c0 1.65685 1.34315 3 3 3s3-1.34315 3-3z"></path>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="18" cy="18" r="3"></circle>
          </svg>
        );

      case DotType.horizontalLine:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="12" cy="12" r="3"></circle>
            <circle cx="18" cy="6" r="3"></circle>
            <path d="M18 15h-6c-1.65685 0-3 1.34315-3 3s1.34315 3 3 3h6c1.65685 0 3-1.34315 3-3s-1.34315-3-3-3"></path>
          </svg>
        );

      case DotType.classy:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M9 3H6C4.34315 3 3 4.34315 3 6v3h3c1.65685 0 3-1.34315 3-3zm3 6c-1.65685 0-3 1.34315-3 3v9h9c1.65685 0 3-1.34315 3-3v-3h-6V9zm9-3V3h-3c-1.65685 0-3 1.34315-3 3v3h3c1.65685 0 3-1.34315 3-3"></path>
          </svg>
        );

      case DotType.classyRounded:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M9 3H6C4.34315 3 3 4.34315 3 6v3h3c1.65685 0 3-1.34315 3-3zm0 12v6h6c3.3137 0 6-2.6863 6-6h-6V9c-3.31373 0-6 2.6863-6 6m12-9V3h-3c-1.65685 0-3 1.34315-3 3v3h3c1.65685 0 3-1.34315 3-3"></path>
          </svg>
        );

      case DotType.smallSquare:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M3.9 3.9h4.2v4.2H3.9zm6 6h4.2v4.2H9.9zm0 6h4.2v4.2H9.9zm6-12h4.2v4.2h-4.2zm0 12h4.2v4.2h-4.2z"></path>
          </svg>
        );

      case DotType.tinySquare:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M4.5 4.5h3v3h-3zm6 6h3v3h-3zm0 6h3v3h-3zm6-12h3v3h-3zm0 12h3v3h-3z"></path>
          </svg>
        );

      case DotType.diamond:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M2.39374 6 6 2.39374 9.60626 6 6 9.60626zm12.00001-.00002L18 2.39374l3.60624 3.60624L18 9.60623zM15 17.39374 12.60626 15l3-3L12 8.39374 8.39374 12l3 3-3 3L12 21.60626l3-3 3 3L21.60626 18 18 14.39374z"></path>
          </svg>
        );

      case DotType.wave:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="18" cy="6" r="3"></circle>
            <path d="M15 15c0-3.90002-1.81482-5.6601-5.70001-6C10.56787 11.71893 9 12 9 15v3c0 1.65686 1.34314 3 3 3h3c3.90002 0 5.6601-1.81488 6-5.70001C18.28107 16.56787 18 15 15 15"></path>
          </svg>
        );

      case DotType.heart:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M6 3.87775c-1.01074-1.1905-3.00574-.60816-3 1.02002.00519.94201.63196 1.5794 1.31262 2.28735.404.4101 1.13611 1.0769 1.68738 1.56757.55115-.49067 1.28326-1.15748 1.68744-1.56757C8.36798 6.47717 8.99487 5.83984 9 4.89777c.00568-1.62818-1.98938-2.21051-3-1.02002m4.31256 9.30737c.40405.41003 1.13617 1.0769 1.68744 1.56757.55115-.49067 1.28326-1.15754 1.68744-1.56757.68048-.708 1.30737-1.34528 1.31256-2.28735.00562-1.62818-1.98938-2.21051-3-1.02002-1.01074-1.1905-3.00574-.60816-3 1.02002.00519.94201.63196 1.57934 1.31256 2.28735M12 15.87775c-1.01074-1.19056-3.00574-.60822-3 1.01996.00519.94207.63196 1.57934 1.31256 2.28741.40405.40997 1.13617 1.07684 1.68744 1.5675.55115-.49066 1.28326-1.15747 1.68744-1.5675.68048-.708 1.30737-1.34528 1.31256-2.28742.00562-1.62817-1.98938-2.2105-3-1.01995m6-7.12506c.55115-.49067 1.28326-1.15748 1.68738-1.56757C20.36792 6.47717 20.9948 5.83984 21 4.89777c.00562-1.62818-1.98938-2.21051-3-1.02002-1.01074-1.1905-3.00574-.60816-3 1.02002.00513.94201.6319 1.5794 1.31256 2.28735.40405.4101 1.13617 1.0769 1.68744 1.56757"></path>
            <path d="M18 15.87775c-1.01074-1.19056-3.00574-.60822-3 1.01996.00513.94207.6319 1.57934 1.31256 2.28741.40405.40997 1.13617 1.07684 1.68744 1.5675.55115-.49066 1.28326-1.15747 1.68738-1.5675.68054-.708 1.30743-1.34528 1.31262-2.28741.00562-1.62818-1.98938-2.21052-3-1.01996"></path>
          </svg>
        );

      case DotType.star:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M6.88171 4.7865 6 3l-.88171 1.7865-1.97144.28644L4.57343 6.4635l-.3368 1.96356L6 7.5l1.76337.92706-.3368-1.96356 1.42664-1.39056zM12 9l-.88171 1.7865-1.97144.28644 1.42658 1.39056-.3368 1.96356L12 13.5l1.76337.92706-.3368-1.96356 1.42664-1.39056-1.9715-.28644zm.88171 7.7865L12 15l-.88171 1.7865-1.97144.28644 1.42658 1.39056-.3368 1.96356L12 19.5l1.76337.92706-.3368-1.96356 1.42664-1.39056zm3.35492-8.35944L18 7.5l1.76337.92706-.3368-1.96356 1.42664-1.39056-1.9715-.28644L18 3l-.88171 1.7865-1.97144.28644 1.42658 1.39056zm2.64508 8.35944L18 15l-.88171 1.7865-1.97144.28644 1.42658 1.39056-.3368 1.96356L18 19.5l1.76337.92706-.3368-1.96356 1.42664-1.39056z"></path>
          </svg>
        );

      case DotType.pentagon:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="m3.14685 5.07294 1.08978 3.35412h3.52674l1.08984-3.35412L6 3zm6 6 1.08978 3.35412h3.52674l1.08984-3.35412L12 9zm0 6 1.08978 3.35412h3.52674l1.08984-3.35412L12 15zm10.61652-8.64588 1.08984-3.35412L18 3l-2.85315 2.07294 1.08978 3.35412zm-4.61652 8.64588 1.08978 3.35412h3.52674l1.08984-3.35412L18 15z"></path>
          </svg>
        );

      case DotType.hexagon:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M3.40192 4.5v3L6 9l2.59808-1.5v-3L6 3zm6 6v3L12 15l2.59808-1.5v-3L12 9zm0 9L12 21l2.59808-1.5v-3L12 15l-2.59808 1.5zM18 3l-2.59808 1.5v3L18 9l2.59808-1.5v-3zm-2.59808 13.5v3L18 21l2.59808-1.5v-3L18 15z"></path>
          </svg>
        );

      case DotType.weave:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M9 4.20001H7.79999V3H4.20001v1.20001H3v3.59998h1.20001V9h3.59998V7.79999H9zm10.79999 0V3h-3.59998v1.20001H15v3.59998h1.20001V9h3.59998V7.79999H21V4.20001zm0 10.79999h-3.59998v1.20001h-2.40002v-2.40002H15v-3.59998h-1.20001V9h-3.59998v1.20001H9v3.59998h1.20001v2.40002H9v3.59998h1.20001V21h3.59998v-1.20001h2.40002V21h3.59998v-1.20001H21v-3.59998h-1.20001z"></path>
          </svg>
        );

      case DotType.zebraVertical:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M12 9.6c-1.32546 0-2.4 1.0745-2.4 2.4v6c0 1.32546 1.07454 2.4 2.4 2.4 1.3255 0 2.4-1.07454 2.4-2.4v-6c0-1.3255-1.0745-2.4-2.4-2.4"></path>
            <circle cx="18" cy="18" r="2.4"></circle>
            <circle cx="18" cy="6" r="2.4"></circle>
            <circle cx="6" cy="6" r="2.4"></circle>
          </svg>
        );

      case DotType.zebraHorizontal:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M20.4 18c0 1.32546-1.0745 2.4-2.4 2.4h-6c-1.32546 0-2.4-1.07454-2.4-2.4 0-1.3255 1.07454-2.4 2.4-2.4h6c1.3255 0 2.4 1.0745 2.4 2.4"></path>
            <circle cx="12" cy="12" r="2.4"></circle>
            <circle cx="18" cy="6" r="2.4"></circle>
            <circle cx="6" cy="6" r="2.4"></circle>
          </svg>
        );

      case DotType.blocksVertical:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M3.59998 3.18994h4.80005V9H3.59998zm6 11.81006v5.37628h4.80004V9.19458H9.59998zm6-11.80597h4.80005v4.75952h-4.80005zm0 11.77948h4.80005v4.96759h-4.80005z"></path>
          </svg>
        );

      case DotType.blocksHorizontal:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M15.28076 3.59998h5.06879v4.79999h-5.06879zm-.28076 12h-4.69104v4.79998h10.22925v-4.79998zm-5.46039-6h5.2312v4.79999h-5.2312zm-5.77826-6H8.5747v4.79999H3.76135z"></path>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
            <path d="M3 3h6v6H3zm6 6v12h12v-6h-6V9zm6-6h6v6h-6z"></path>
          </svg>
        );
    }
  };

  return getSVG();
}
