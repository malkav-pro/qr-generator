'use client';

import { useState, useCallback } from 'react';
import {
  TypeSelector,
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
import { getQRForm } from '@/lib/registry';
import { type QRTypeKey } from '@/lib/formatters';
import type {
  QRConfig,
  DotType,
  CornerSquareType,
  CornerDotType,
} from '@/lib/types/qr-config';

export default function Home() {
  // QR Type state
  const [qrType, setQrType] = useState<QRTypeKey>('url');

  // Data state (raw input for URL/text, formatted mailto for email)
  const [data, setData] = useState('');

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
  const handleTypeChange = useCallback((newType: QRTypeKey) => {
    setQrType(newType);
    setData('');
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
    scale: 10,
    foregroundGradient,
    dotsStyle,
    cornersSquareStyle,
    cornersDotStyle,
    cornersSquareColor: cornerSquareColor,
    cornersDotColor: cornerDotColor,
    logo: logo
      ? {
          image: logo,
          size: 0.33,
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
      size: 0.33,
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
  // Generate at 400px for crisp display without scaling artifacts
  const { containerRef, isGenerating, error } = useQRCode(qrConfig, 300, 400);

  // Check contrast for export button disabled state
  const hasData = data.trim().length > 0;
  const canExport = hasData && !isGenerating && !error;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] relative">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[var(--accent-start)] to-transparent opacity-[0.03] blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[var(--accent-end)] to-transparent opacity-[0.02] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:px-12 lg:py-12">
          <div className="flex items-end gap-3">
            <div className="w-1.5 h-12 bg-gradient-to-b from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" />
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight gradient-text leading-none">
                QR Code Generator
              </h1>
              <p className="mt-2 text-base lg:text-lg text-[var(--text-secondary)] font-medium">
                Generate QR codes you own — no tracking, no redirects
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-12 lg:py-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_420px] gap-8 lg:gap-12 items-start">
          {/* Controls Section - Left column on desktop */}
          <div className="lg:order-1 space-y-6">
            <ControlSection title="Data Input" defaultOpen>
              <TypeSelector value={qrType} onChange={handleTypeChange} />
              {(() => {
                const FormComponent = getQRForm(qrType);
                return (
                  <FormComponent
                    onDataChange={handleDataChange}
                    initialValue={data}
                  />
                );
              })()}
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
          <div className="lg:order-2 sticky top-6">
            <div className="relative bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-medium)] p-8 transition-all duration-300 hover:border-[var(--border-strong)]"
                 style={{ boxShadow: 'var(--shadow-lg)' }}>
              {/* Accent corner decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--accent-start)] to-transparent opacity-10 rounded-tr-2xl" />

              <QRPreview
                containerRef={containerRef}
                isGenerating={isGenerating}
                error={error}
              />
              <div className="mt-8 flex flex-col gap-3">
                <ExportButton
                  qrConfig={qrConfig}
                  disabled={!canExport}
                  filename="qrcode"
                />
                <ShareButton className="w-full" />
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
