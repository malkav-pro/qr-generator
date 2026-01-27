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
  ShareButton,
  Footer,
} from '@/components';
import { ControlSection } from '@/components/ui';
import { useQRCode } from '@/hooks/useQRCode';
import { useURLState } from '@/hooks/useURLState';
import { extractSolidColor, parseGradientCSS } from '@/lib/utils/gradient-parser';
import { fromShareableConfig, type ShareableConfig } from '@/lib/url-state';
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

  // URL state synchronization - restore config from URL on mount
  const handleRestore = useCallback((restored: ShareableConfig) => {
    // Preserve existing logo when restoring from URL
    const fullConfig = fromShareableConfig(restored, logo ? {
      image: logo,
      size: 0.25,
      margin: 0,
      hideBackgroundDots: true,
    } : undefined);

    // Restore all state from config
    setQrType(fullConfig.type);
    setData(fullConfig.data);
    setBackground(fullConfig.background);

    // Restore gradient or solid foreground
    if (fullConfig.foregroundGradient) {
      setColorMode('gradient');
      const gradient = fullConfig.foregroundGradient;
      setGradientStart(gradient.colorStops[0].color);
      setGradientEnd(gradient.colorStops[1].color);

      // Determine gradient type from rotation
      const rotation = gradient.rotation;
      if (gradient.type === 'radial') {
        setGradientType('radial');
      } else if (rotation === Math.PI / 2) {
        setGradientType('vertical');
      } else if (rotation === (3 * Math.PI) / 4) {
        setGradientType('diagonal');
      } else {
        setGradientType('horizontal');
      }
    } else {
      setColorMode('solid');
      setForeground(fullConfig.foreground);
    }

    // Restore styles
    if (fullConfig.dotsStyle) setDotsStyle(fullConfig.dotsStyle);
    if (fullConfig.cornersSquareStyle) setCornersSquareStyle(fullConfig.cornersSquareStyle);
    if (fullConfig.cornersDotStyle) setCornersDotStyle(fullConfig.cornersDotStyle);
    if (fullConfig.cornersSquareColor) setCornerSquareColor(fullConfig.cornersSquareColor);
    if (fullConfig.cornersDotColor) setCornerDotColor(fullConfig.cornersDotColor);
  }, [logo]);

  useURLState(qrConfig, handleRestore, { delay: 500 });

  // Use the QR code hook with 300ms debounce (PREVIEW-02)
  const { canvasRef, isGenerating, error } = useQRCode(qrConfig, 300);

  // Check contrast for export button disabled state
  const hasData = data.trim().length > 0;
  const canExport = hasData && !isGenerating && !error;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      {/* Header */}
      <header className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
            QR Code Generator
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[var(--color-text-muted)]">
            Generate QR codes you own - no tracking, no redirects
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section - Left column on desktop */}
          <div className="lg:order-1 space-y-4">
            <ControlSection title="Data Input" defaultOpen>
              <TypeSelector value={qrType} onChange={handleTypeChange} />
              <DataInput
                type={qrType}
                value={data}
                emailData={emailData}
                onChange={handleDataChange}
                onEmailChange={handleEmailChange}
              />
            </ControlSection>

            <ControlSection title="Colors">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  label="Corner Square"
                  color={cornerSquareColor}
                  onChange={setCornerSquareColor}
                />
                <ColorPicker
                  label="Corner Dot"
                  color={cornerDotColor}
                  onChange={setCornerDotColor}
                />
              </div>
            </ControlSection>

            <ControlSection title="Styles">
              <div className="space-y-4">
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
            </ControlSection>

            <ControlSection title="Logo">
              <LogoUploader logo={logo} onLogoChange={setLogo} qrSize={300} />
            </ControlSection>
          </div>

          {/* Preview Section - Right column on desktop, sticky */}
          <div className="lg:order-2 lg:sticky lg:top-8 lg:self-start">
            <div className="bg-[var(--color-surface-raised)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <QRPreview
                canvasRef={canvasRef}
                isGenerating={isGenerating}
                error={error}
              />
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <ExportButton
                  qrConfig={qrConfig}
                  disabled={!canExport}
                  filename="qrcode"
                />
                <ShareButton className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
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
