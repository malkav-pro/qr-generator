'use client';

import { useState } from 'react';
import { TypeSelector } from '@/components/TypeSelector';
import { DataInput } from '@/components/DataInput';
import { useQRCode } from '@/hooks/useQRCode';
import type { QRType, EmailData, QRConfig } from '@/lib/types/qr-config';

export default function Home() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [data, setData] = useState('');
  const [emailData, setEmailData] = useState<EmailData>({ to: '' });

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
    foreground: '#000000',
    background: '#ffffff',
    errorCorrectionLevel: 'H',
    scale: 10
  };

  // Use the QR code hook with 300ms debounce
  const { canvasRef, isGenerating, error } = useQRCode(qrConfig, 300);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">QR Code Generator</h1>

      <div className="max-w-2xl space-y-6">
        <TypeSelector value={qrType} onChange={setQrType} />

        <DataInput
          type={qrType}
          value={data}
          emailData={emailData}
          onChange={handleDataChange}
          onEmailChange={handleEmailChange}
        />

        <div className="mt-6 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">QR Code Preview (Debounced 300ms)</h2>
          {isGenerating && <p className="text-blue-600 mb-2">Generating...</p>}
          {error && <p className="text-red-600 mb-2">Error: {error}</p>}
          <canvas ref={canvasRef} className="border border-gray-200"></canvas>
        </div>
      </div>
    </div>
  );
}
