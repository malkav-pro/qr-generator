'use client';

import { useRef, useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { STANDARD_LOGOS } from '@/lib/constants/standard-logos';
import { ColorPicker } from './ColorPicker';
import { validateLogoFile } from '@/lib/utils/logo-validation';

export interface LogoPickerProps {
  logo: string | null;
  onLogoChange: (dataURL: string | null) => void;
  onLogoSizeChange?: (size: number) => void;
  qrSize?: number;
}

type LogoSelection = 'none' | 'upload' | string; // 'none', 'upload', or standard logo ID

export function LogoPicker({ logo, onLogoChange, onLogoSizeChange, qrSize = 300 }: LogoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLogo, setSelectedLogo] = useState<LogoSelection>('none');
  const [customLogoData, setCustomLogoData] = useState<string | null>(null);
  const [logoColor, setLogoColor] = useState<string>('#000000');
  const [dragActive, setDragActive] = useState(false);

  // Sync with external logo changes
  useEffect(() => {
    if (!logo) {
      // External logo was cleared
      if (selectedLogo !== 'none') {
        setSelectedLogo('none');
        setCustomLogoData(null);
      }
    }
  }, [logo, selectedLogo]);

  const handleStandardLogoSelect = (logoId: string) => {
    setSelectedLogo(logoId);
    setCustomLogoData(null); // Clear custom logo data
    // Clear file input to allow re-uploading
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    const logoData = STANDARD_LOGOS.find(l => l.id === logoId);
    if (logoData) {
      onLogoChange(logoData.getDataURL(logoColor));
    }
    // Standard logos use 33% size
    if (onLogoSizeChange) {
      onLogoSizeChange(0.4);
    }
  };

  const handleLogoColorChange = (color: string) => {
    setLogoColor(color);
    // If a standard logo is selected, regenerate with new color
    if (selectedLogo !== 'none' && selectedLogo !== 'upload') {
      const logoData = STANDARD_LOGOS.find(l => l.id === selectedLogo);
      if (logoData) {
        onLogoChange(logoData.getDataURL(color));
      }
    }
  };

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
      // Update state first
      setCustomLogoData(dataURL);
      setSelectedLogo('upload');
      // Then notify parent
      onLogoChange(dataURL);
      // Custom logos use same size as standard logos
      if (onLogoSizeChange) {
        onLogoSizeChange(0.4);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    if (selectedLogo === 'upload' && customLogoData) {
      // Already uploaded, clicking removes it
      handleRemoveLogo();
    } else {
      // Open file picker
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
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

  const handleRemoveLogo = () => {
    setSelectedLogo('none');
    setCustomLogoData(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        Logo (Optional)
      </label>

      {/* Logo Color Picker */}
      <ColorPicker
        label="Logo Color"
        color={logoColor}
        onChange={handleLogoColorChange}
        allowTransparent={false}
      />

      {/* Unified Logo Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {/* None Option */}
        <button
          type="button"
          onClick={handleRemoveLogo}
          className={`
            relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
            hover:scale-[1.02] active:scale-[0.98]
            ${selectedLogo === 'none'
              ? 'border-[var(--accent-start)] bg-[var(--accent-glow)] shadow-[0_0_16px_var(--accent-glow)]'
              : 'border-[var(--border-medium)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)]'
            }
          `}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />
          </div>
          <span className={`text-xs font-semibold tracking-tight text-center ${
            selectedLogo === 'none' ? 'text-[var(--accent-start)]' : 'text-[var(--text-secondary)]'
          }`}>
            None
          </span>
        </button>

        {/* Upload Option */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
            ${dragActive
              ? 'border-[var(--accent-start)] bg-[var(--accent-glow)] scale-[1.02]'
              : selectedLogo === 'upload'
                ? 'border-[var(--accent-start)] bg-[var(--accent-glow)] shadow-[0_0_16px_var(--accent-glow)]'
                : 'border-[var(--border-medium)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)] hover:scale-[1.02] active:scale-[0.98]'
            }
            cursor-pointer
          `}
          onClick={handleUploadClick}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            {selectedLogo === 'upload' && customLogoData ? (
              <img
                src={customLogoData}
                alt="Custom logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <Upload className="w-6 h-6 text-[var(--text-secondary)]" strokeWidth={2} />
            )}
          </div>
          <span className={`text-xs font-semibold tracking-tight text-center ${
            selectedLogo === 'upload' ? 'text-[var(--accent-start)]' : 'text-[var(--text-secondary)]'
          }`}>
            Upload
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Standard Logo Icons */}
        {STANDARD_LOGOS.map((standardLogo) => {
          const isSelected = selectedLogo === standardLogo.id;
          return (
            <button
              key={standardLogo.id}
              type="button"
              onClick={() => handleStandardLogoSelect(standardLogo.id)}
              className={`
                relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
                hover:scale-[1.02] active:scale-[0.98]
                ${isSelected
                  ? 'border-[var(--accent-start)] bg-[var(--accent-glow)] shadow-[0_0_16px_var(--accent-glow)]'
                  : 'border-[var(--border-medium)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)]'
                }
              `}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src={standardLogo.getDataURL(logoColor)}
                  alt={standardLogo.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={`text-xs font-semibold tracking-tight text-center ${
                isSelected ? 'text-[var(--accent-start)]' : 'text-[var(--text-secondary)]'
              }`}>
                {standardLogo.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
