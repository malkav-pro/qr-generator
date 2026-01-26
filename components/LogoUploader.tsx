'use client';

import { useRef, useState } from 'react';
import { validateLogoFile, calculateLogoPercentage, getRecommendedLogoSize } from '@/lib/utils/logo-validation';

export interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (dataURL: string | null) => void;
  qrSize?: number;
}

export function LogoUploader({ logo, onLogoChange, qrSize = 300 }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [warning, setWarning] = useState<{ message: string; level: 'warning' | 'danger' } | null>(null);

  const handleFile = (file: File) => {
    // Validate file
    const validation = validateLogoFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Read file and convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target?.result as string;

      // Load image to check dimensions
      const img = new Image();
      img.onload = () => {
        // Calculate logo percentage
        const { percentage, level } = calculateLogoPercentage(img.width, img.height, qrSize);

        // Set warning if needed
        if (level === 'warning') {
          const recommended = getRecommendedLogoSize(qrSize);
          setWarning({
            level: 'warning',
            message: `Logo covers ${percentage.toFixed(1)}% of QR code. Consider resizing to ${recommended.width}×${recommended.height}px for optimal scannability.`,
          });
        } else if (level === 'danger') {
          const recommended = getRecommendedLogoSize(qrSize);
          setWarning({
            level: 'danger',
            message: `Warning: Logo covers ${percentage.toFixed(1)}% of QR code (max 25%). QR code may be difficult to scan. Resize to ${recommended.width}×${recommended.height}px or smaller.`,
          });
        } else {
          setWarning(null);
        }

        onLogoChange(dataURL);
      };
      img.src = dataURL;
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onLogoChange(null);
    setWarning(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Logo (Optional)
      </label>

      {!logo ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="space-y-2">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-700">
                Click to upload
              </span>
              {' or drag and drop'}
            </div>
            <div className="text-xs text-gray-500">
              PNG or JPG (max 5MB)
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative inline-block">
            <img
              src={logo}
              alt="Logo preview"
              className="max-w-[150px] max-h-[150px] border-2 border-gray-200 rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Remove logo"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {warning && (
        <div
          className={`p-3 rounded-lg text-sm ${
            warning.level === 'warning'
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {warning.message}
        </div>
      )}
    </div>
  );
}
