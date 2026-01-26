'use client';

import { useState, useCallback } from 'react';
import {
  TypeSelector,
  DataInput,
  ColorPicker,
  ContrastWarning,
  QRPreview,
  ExportButton,
} from '@/components';
import { useQRCode } from '@/hooks/useQRCode';
import { validateContrast } from '@/lib/contrast-validation';
import type { QRType, EmailData, QRConfig } from '@/lib/types/qr-config';

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
  const qrConfig: QRConfig = {
    type: qrType,
    data: data,
    foreground: foreground,
    background: background,
    errorCorrectionLevel: 'H',  // TECH-01: Always use highest error correction
    scale: 10,
  };

  // Use the QR code hook with 300ms debounce (PREVIEW-02)
  const { canvasRef, isGenerating, error } = useQRCode(qrConfig, 300);

  // Check contrast for export button disabled state
  const hasValidContrast = validateContrast(foreground, background, 12);
  const hasData = data.trim().length > 0;
  const canExport = hasData && hasValidContrast && !isGenerating && !error;

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
                  canvasRef={canvasRef}
                  disabled={!canExport}
                  filename="qrcode.png"
                />
                {!hasValidContrast && hasData && (
                  <p className="mt-2 text-sm text-amber-600">
                    Improve contrast ratio for better scan reliability
                  </p>
                )}
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
                <ColorPicker
                  label="Foreground"
                  color={foreground}
                  onChange={setForeground}
                />
                <ColorPicker
                  label="Background"
                  color={background}
                  onChange={setBackground}
                />
              </div>
              <div className="mt-6">
                <ContrastWarning
                  foreground={foreground}
                  background={background}
                  minRatio={12}
                />
              </div>
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
