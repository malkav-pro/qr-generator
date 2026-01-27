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
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        Logo (Optional)
      </label>

      {!logo ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)] ${
            dragActive
              ? 'border-[var(--accent-start)] bg-[var(--accent-glow)]'
              : 'border-[var(--border-medium)] hover:border-[var(--accent-start)] hover:bg-[var(--accent-glow)]'
          }`}
        >
          <div className="space-y-2">
            <div className="text-[var(--text-secondary)]">
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
            <div className="text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--accent-start)] hover:text-[var(--accent-end)] transition-colors duration-200">
                Click to upload
              </span>
              {' or drag and drop'}
            </div>
            <div className="text-xs text-[var(--text-muted)] font-medium">
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
              className="max-w-[150px] max-h-[150px] border-2 border-[var(--border-medium)] rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center
                hover:bg-red-600 transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
                shadow-md hover:shadow-lg"
              title="Remove logo"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
