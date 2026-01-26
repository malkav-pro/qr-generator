'use client';

import { useState } from 'react';
import {
  TypeSelector,
  DataInput,
  ColorPicker,
  ContrastWarning,
  QRPreview,
} from '@/components';
import { useQRCode } from '@/hooks/useQRCode';
import type { QRType, EmailData, QRConfig } from '@/lib/types/qr-config';

export default function Home() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [data, setData] = useState('');
  const [emailData, setEmailData] = useState<EmailData>({ to: '' });
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');

  const handleEmailChange = (newEmailData: EmailData) => {
    setEmailData(newEmailData);
    console.log('Email data updated:', newEmailData);
  };

  const handleDataChange = (newData: string) => {
    setData(newData);
    console.log('Data updated:', newData);
  };

  // Create QR config for the hook
  const qrConfig: QRConfig = {
    type: qrType,
    data: data,
    foreground: foreground,
    background: background,
    errorCorrectionLevel: 'H',
    scale: 10
  };

  // Use the QR code hook with 300ms debounce
  const { canvasRef, isGenerating, error } = useQRCode(qrConfig, 300);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-gray-600 mb-8">
          Create custom QR codes with colors and multiple data types
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Configuration */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Content</h2>
              <div className="space-y-4">
                <TypeSelector value={qrType} onChange={setQrType} />
                <DataInput
                  type={qrType}
                  value={data}
                  emailData={emailData}
                  onChange={handleDataChange}
                  onEmailChange={handleEmailChange}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Colors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="mt-4">
                <ContrastWarning
                  foreground={foreground}
                  background={background}
                  minRatio={12}
                />
              </div>
            </div>
          </div>

          {/* Right column: Preview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <QRPreview
              canvasRef={canvasRef}
              isGenerating={isGenerating}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
