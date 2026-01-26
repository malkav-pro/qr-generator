export type QRType = 'url' | 'text' | 'email';

export interface EmailData {
  to: string;
  subject?: string;
  body?: string;
}

export interface QRConfig {
  type: QRType;
  data: string;           // The actual content (URL, text, or formatted mailto)
  foreground: string;     // Hex color for dark modules
  background: string;     // Hex color for light modules
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  scale: number;          // Module size multiplier
}

export interface ExportConfig {
  dpi: number;
  width: number;          // Target width in inches
  height: number;         // Target height in inches
}
