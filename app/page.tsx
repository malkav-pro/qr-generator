'use client';

import { useState, useCallback } from 'react';
import {
  TypeSelector,
  ColorPicker,
  PerElementColorControl,
  MatchDotsControl,
  ContrastWarning,
  QRPreview,
  ExportButton,
  DotStylePicker,
  CornerSquareStylePicker,
  CornerDotStylePicker,
  ShapePicker,
  LogoPicker,
  ShareButton,
  Footer,
  BackgroundImagePicker,
} from '@/components';
import { ControlSection } from '@/components/ui';
import { useQRCode } from '@/hooks/useQRCode';
import { useURLState } from '@/hooks/useURLState';
import { fromShareableConfig, type ShareableConfig } from '@/lib/url-state';
import { getQRForm } from '@/lib/registry';
import { type QRTypeKey } from '@/lib/formatters';
import type {
  QRConfig,
  ShapeType,
  DotType,
  CornerSquareType,
  CornerDotType,
} from '@/lib/types/qr-config';
import type { Gradient } from '@/lib/types/gradient';

export default function Home() {
  // QR Type state
  const [qrType, setQrType] = useState<QRTypeKey>('url');

  // Data state (raw input for URL/text, formatted mailto for email)
  const [data, setData] = useState('');

  // Per-element color state
  // Dots element
  const [dotsMode, setDotsMode] = useState<'solid' | 'gradient'>('solid');
  const [dotsSolidColor, setDotsSolidColor] = useState('#000000');
  const [dotsGradient, setDotsGradient] = useState<Gradient | null>(null);

  // Corner squares
  const [cornersSquareMode, setCornersSquareMode] = useState<'solid' | 'gradient'>('solid');
  const [cornersSquareSolidColor, setCornersSquareSolidColor] = useState('#000000');
  const [cornersSquareGradient, setCornersSquareGradient] = useState<Gradient | null>(null);
  const [cornersSquareMatchDots, setCornersSquareMatchDots] = useState(false);

  // Corner dots
  const [cornersDotMode, setCornersDotMode] = useState<'solid' | 'gradient'>('solid');
  const [cornersDotSolidColor, setCornersDotSolidColor] = useState('#000000');
  const [cornersDotGradient, setCornersDotGradient] = useState<Gradient | null>(null);
  const [cornersDotMatchDots, setCornersDotMatchDots] = useState(false);

  // Background
  const [backgroundMode, setBackgroundMode] = useState<'solid' | 'gradient'>('solid');
  const [backgroundSolidColor, setBackgroundSolidColor] = useState('#ffffff');
  const [backgroundGradient, setBackgroundGradient] = useState<Gradient | null>(null);

  // Style customization
  const [shape, setShape] = useState<ShapeType>('square');
  const [dotsStyle, setDotsStyle] = useState<DotType>('square');
  const [cornersSquareStyle, setCornersSquareStyle] =
    useState<CornerSquareType>('square');
  const [cornersDotStyle, setCornersDotStyle] =
    useState<CornerDotType>('square');

  // Logo overlay
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(0.4);

  // Background image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(1.0);

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
  const qrConfig: QRConfig = {
    type: qrType,
    data: data,
    foreground: dotsMode === 'solid' ? dotsSolidColor : '#000000',
    dotsGradient: dotsMode === 'gradient' ? dotsGradient ?? undefined : undefined,
    // When background image is set, force transparent background (no solid or gradient)
    background: backgroundImage ? 'transparent' : (backgroundMode === 'solid' ? backgroundSolidColor : '#ffffff'),
    backgroundGradient: backgroundImage ? undefined : (backgroundMode === 'gradient' ? backgroundGradient ?? undefined : undefined),
    errorCorrectionLevel: 'H',  // TECH-01: Always use highest error correction
    scale: 14, // 14 * 25 = 350px, fills preview container nicely
    shape,
    dotsStyle,
    cornersSquareStyle,
    cornersDotStyle,
    cornersSquareColor: cornersSquareMatchDots
      ? (dotsMode === 'solid' ? dotsSolidColor : undefined)
      : (cornersSquareMode === 'solid' ? cornersSquareSolidColor : undefined),
    cornersSquareGradient: cornersSquareMatchDots
      ? (dotsMode === 'gradient' ? dotsGradient ?? undefined : undefined)
      : (cornersSquareMode === 'gradient' ? cornersSquareGradient ?? undefined : undefined),
    cornersDotColor: cornersDotMatchDots
      ? (dotsMode === 'solid' ? dotsSolidColor : undefined)
      : (cornersDotMode === 'solid' ? cornersDotSolidColor : undefined),
    cornersDotGradient: cornersDotMatchDots
      ? (dotsMode === 'gradient' ? dotsGradient ?? undefined : undefined)
      : (cornersDotMode === 'gradient' ? cornersDotGradient ?? undefined : undefined),
    logo: logo
      ? {
          image: logo,
          size: logoSize,
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
      size: logoSize,
      margin: 0,
      hideBackgroundDots: true,
    } : undefined);

    // Restore all state from config
    setQrType(fullConfig.type);
    setData(fullConfig.data);

    // Restore dots element
    if (fullConfig.dotsGradient) {
      setDotsMode('gradient');
      setDotsGradient(fullConfig.dotsGradient);
    } else {
      setDotsMode('solid');
      setDotsSolidColor(fullConfig.foreground);
    }

    // Restore corner squares
    if (fullConfig.cornersSquareGradient) {
      setCornersSquareMode('gradient');
      setCornersSquareGradient(fullConfig.cornersSquareGradient);
    } else if (fullConfig.cornersSquareColor) {
      setCornersSquareMode('solid');
      setCornersSquareSolidColor(fullConfig.cornersSquareColor);
    }
    setCornersSquareMatchDots(false); // Default to false on restore

    // Restore corner dots
    if (fullConfig.cornersDotGradient) {
      setCornersDotMode('gradient');
      setCornersDotGradient(fullConfig.cornersDotGradient);
    } else if (fullConfig.cornersDotColor) {
      setCornersDotMode('solid');
      setCornersDotSolidColor(fullConfig.cornersDotColor);
    }
    setCornersDotMatchDots(false); // Default to false on restore

    // Restore background
    if (fullConfig.backgroundGradient) {
      setBackgroundMode('gradient');
      setBackgroundGradient(fullConfig.backgroundGradient);
    } else {
      setBackgroundMode('solid');
      setBackgroundSolidColor(fullConfig.background);
    }

    // Restore styles
    if (fullConfig.dotsStyle) setDotsStyle(fullConfig.dotsStyle);
    if (fullConfig.cornersSquareStyle) setCornersSquareStyle(fullConfig.cornersSquareStyle);
    if (fullConfig.cornersDotStyle) setCornersDotStyle(fullConfig.cornersDotStyle);
  }, [logo, logoSize]);

  useURLState(handleRestore);

  // Use the QR code hook with 300ms debounce (PREVIEW-02)
  // Auto-size based on scale (10 * 25 = 250px base size)
  const { containerRef, isGenerating, error } = useQRCode(qrConfig, 300);

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
              <div className="space-y-6">
                <PerElementColorControl
                  label="Dots"
                  mode={dotsMode}
                  solidColor={dotsSolidColor}
                  gradient={dotsGradient}
                  onModeChange={setDotsMode}
                  onSolidColorChange={setDotsSolidColor}
                  onGradientChange={setDotsGradient}
                />
                <MatchDotsControl
                  label="Corner Squares"
                  matchDots={cornersSquareMatchDots}
                  onMatchDotsChange={setCornersSquareMatchDots}
                  dotsMode={dotsMode}
                  dotsSolidColor={dotsSolidColor}
                  dotsGradient={dotsGradient}
                  mode={cornersSquareMode}
                  solidColor={cornersSquareSolidColor}
                  gradient={cornersSquareGradient}
                  onModeChange={setCornersSquareMode}
                  onSolidColorChange={setCornersSquareSolidColor}
                  onGradientChange={setCornersSquareGradient}
                />
                <MatchDotsControl
                  label="Corner Dots"
                  matchDots={cornersDotMatchDots}
                  onMatchDotsChange={setCornersDotMatchDots}
                  dotsMode={dotsMode}
                  dotsSolidColor={dotsSolidColor}
                  dotsGradient={dotsGradient}
                  mode={cornersDotMode}
                  solidColor={cornersDotSolidColor}
                  gradient={cornersDotGradient}
                  onModeChange={setCornersDotMode}
                  onSolidColorChange={setCornersDotSolidColor}
                  onGradientChange={setCornersDotGradient}
                />
                <PerElementColorControl
                  label="Background"
                  mode={backgroundMode}
                  solidColor={backgroundSolidColor}
                  gradient={backgroundGradient}
                  onModeChange={setBackgroundMode}
                  onSolidColorChange={setBackgroundSolidColor}
                  onGradientChange={setBackgroundGradient}
                  allowTransparent={true}
                />
              </div>
            </ControlSection>

            <ControlSection title="Styles">
              <div className="space-y-4">
                <ShapePicker value={shape} onChange={setShape} />
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
              <LogoPicker
                logo={logo}
                onLogoChange={setLogo}
                onLogoSizeChange={setLogoSize}
                qrSize={300}
              />
            </ControlSection>

            <ControlSection title="Background Image">
              <BackgroundImagePicker
                backgroundImage={backgroundImage}
                onBackgroundImageChange={setBackgroundImage}
                backgroundOpacity={backgroundOpacity}
                onOpacityChange={setBackgroundOpacity}
              />
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
                backgroundImage={backgroundImage}
                backgroundOpacity={backgroundOpacity}
              />
              <div className="mt-8 flex flex-col gap-3">
                <ExportButton
                  qrConfig={qrConfig}
                  disabled={!canExport}
                  filename="qrcode"
                />
                <ShareButton qrConfig={qrConfig} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
