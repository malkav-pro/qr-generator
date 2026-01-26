'use client';

import { useState, useCallback } from 'react';
import {
  TypeSelector,
  DataInput,
  ColorPicker,
  GradientColorPicker,
  ContrastWarning,
  QRPreview,
  ExportButton,
  DotStylePicker,
  CornerSquareStylePicker,
  CornerDotStylePicker,
  LogoUploader,
} from '@/components';
import { useQRCode } from '@/hooks/useQRCode';
import { extractSolidColor, parseGradientCSS } from '@/lib/utils/gradient-parser';
import type {
  QRType,
  EmailData,
  QRConfig,
  DotType,
  CornerSquareType,
  CornerDotType,
} from '@/lib/types/qr-config';

export default function Home() {
  // QR Type state
  const [qrType, setQrType] = useState<QRType>('url');

  // Data state (raw input for URL/text, formatted mailto for email)
  const [data, setData] = useState('');

  // Email-specific data for the email form
  const [emailData, setEmailData] = useState<EmailData>({ to: '' });

  // Color customization
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [colorMode, setColorMode] = useState<'solid' | 'gradient'>('solid');
  const [gradientStart, setGradientStart] = useState('#000000');
  const [gradientEnd, setGradientEnd] = useState('#333333');
  const [gradientType, setGradientType] = useState<'horizontal' | 'vertical' | 'diagonal' | 'radial'>(
    'horizontal'
  );
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000');
  const [cornerDotColor, setCornerDotColor] = useState('#000000');

  // Style customization
  const [dotsStyle, setDotsStyle] = useState<DotType>('square');
  const [cornersSquareStyle, setCornersSquareStyle] =
    useState<CornerSquareType>('square');
  const [cornersDotStyle, setCornersDotStyle] =
    useState<CornerDotType>('square');

  // Logo overlay
  const [logo, setLogo] = useState<string | null>(null);

  // Handle type changes - clear data when switching types
  const handleTypeChange = useCallback((newType: QRType) => {
    setQrType(newType);
    setData('');
    setEmailData({ to: '' });
  }, []);

  // Handle email data changes
  const handleEmailChange = useCallback((newEmailData: EmailData) => {
    setEmailData(newEmailData);
  }, []);

  // Handle data changes
  const handleDataChange = useCallback((newData: string) => {
    setData(newData);
  }, []);

  // Build QR config from state
  const gradientCSS =
    colorMode === 'gradient'
      ? buildGradientCSS(gradientType, gradientStart, gradientEnd)
      : '';
  const foregroundGradient =
    colorMode === 'gradient' ? parseGradientCSS(gradientCSS) ?? undefined : undefined;
  const effectiveForeground =
    colorMode === 'gradient' ? extractSolidColor(gradientCSS) : foreground;
  const contrastForeground =
    effectiveForeground.length === 9 ? effectiveForeground.slice(0, 7) : effectiveForeground;

  const qrConfig: QRConfig = {
    type: qrType,
    data: data,
    foreground: effectiveForeground,
    background: background,
    errorCorrectionLevel: 'H',  // TECH-01: Always use highest error correction
    scale: 12,
    foregroundGradient,
    dotsStyle,
    cornersSquareStyle,
    cornersDotStyle,
    cornersSquareColor: cornerSquareColor,
    cornersDotColor: cornerDotColor,
    logo: logo
      ? {
          image: logo,
          size: 0.25,
          margin: 0,
          hideBackgroundDots: true,
        }
      : undefined,
  };

  // Use the QR code hook with 300ms debounce (PREVIEW-02)
  const { canvasRef, isGenerating, error } = useQRCode(qrConfig, 300);

  // Check contrast for export button disabled state
  const hasData = data.trim().length > 0;
  const canExport = hasData && !isGenerating && !error;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            QR Code Generator
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Generate QR codes you own - no tracking, no redirects
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Mobile Layout: Preview first, then controls */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* QR Preview Section - Full width on mobile, right column on desktop */}
          <section className="md:order-2" aria-labelledby="preview-heading">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <h2 id="preview-heading" className="text-lg font-semibold mb-4 text-gray-900">
                Preview
              </h2>
              <QRPreview
                canvasRef={canvasRef}
                isGenerating={isGenerating}
                error={error}
              />
              <div className="mt-6">
                <ExportButton
                  qrConfig={qrConfig}
                  disabled={!canExport}
                  filename="qrcode"
                />
                
              </div>
            </div>
          </section>

          {/* Controls Section - Below preview on mobile, left column on desktop */}
          <section className="md:order-1 space-y-6" aria-labelledby="controls-heading">
            <h2 id="controls-heading" className="sr-only">
              QR Code Configuration
            </h2>

            {/* Content Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Content
              </h3>
              <div className="space-y-4">
                <TypeSelector value={qrType} onChange={handleTypeChange} />
                <DataInput
                  type={qrType}
                  value={data}
                  emailData={emailData}
                  onChange={handleDataChange}
                  onEmailChange={handleEmailChange}
                />
              </div>
            </div>

            {/* Colors Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Colors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <GradientColorPicker
                  label="Foreground"
                  solidColor={foreground}
                  gradientStart={gradientStart}
                  gradientEnd={gradientEnd}
                  gradientType={gradientType}
                  mode={colorMode}
                  onSolidChange={setForeground}
                  onGradientStartChange={setGradientStart}
                  onGradientEndChange={setGradientEnd}
                  onGradientTypeChange={setGradientType}
                  onModeChange={setColorMode}
                />
                <ColorPicker
                  label="Background"
                  color={background}
                  onChange={setBackground}
                  allowTransparent
                />
                <ColorPicker
                  label="Corner Square Color"
                  color={cornerSquareColor}
                  onChange={setCornerSquareColor}
                />
                <ColorPicker
                  label="Corner Dot Color"
                  color={cornerDotColor}
                  onChange={setCornerDotColor}
                />
              </div>
              
            </div>

            {/* Styles Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Styles
              </h3>
              <div className="space-y-6">
                <DotStylePicker value={dotsStyle} onChange={setDotsStyle} />
                <CornerSquareStylePicker
                  value={cornersSquareStyle}
                  onChange={setCornersSquareStyle}
                />
                <CornerDotStylePicker
                  value={cornersDotStyle}
                  onChange={setCornersDotStyle}
                />
              </div>
            </div>

            {/* Logo Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Logo
              </h3>
              <LogoUploader logo={logo} onLogoChange={setLogo} qrSize={300} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Client-side QR generation - your data never leaves your browser
          </p>
        </div>
      </footer>
    </div>
  );
}

function buildGradientCSS(
  type: 'horizontal' | 'vertical' | 'diagonal' | 'radial',
  start: string,
  end: string
): string {
  switch (type) {
    case 'vertical':
      return `linear-gradient(180deg, ${start} 0%, ${end} 100%)`;
    case 'diagonal':
      return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
    case 'radial':
      return `radial-gradient(circle, ${start} 0%, ${end} 100%)`;
    case 'horizontal':
    default:
      return `linear-gradient(90deg, ${start} 0%, ${end} 100%)`;
  }
}
