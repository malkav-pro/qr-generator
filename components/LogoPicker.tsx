'use client';

import { useState } from 'react';
import { STANDARD_LOGOS } from '@/lib/constants/standard-logos';
import { LogoUploader } from './LogoUploader';

export interface LogoPickerProps {
  logo: string | null;
  onLogoChange: (dataURL: string | null) => void;
  onLogoSizeChange?: (size: number) => void;
  qrSize?: number;
}

export function LogoPicker({ logo, onLogoChange, onLogoSizeChange, qrSize = 300 }: LogoPickerProps) {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);

  const handleStandardLogoSelect = (logoId: string, dataURL: string) => {
    setSelectedLogoId(logoId);
    onLogoChange(dataURL);
    // Standard logos use 33% size
    if (onLogoSizeChange) {
      onLogoSizeChange(0.33);
    }
  };

  const handleCustomLogoChange = (dataURL: string | null) => {
    setSelectedLogoId(null); // Clear standard logo selection
    onLogoChange(dataURL);
    // Custom logos use default 20% size
    if (dataURL && onLogoSizeChange) {
      onLogoSizeChange(0.2);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedLogoId(null);
    onLogoChange(null);
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        Logo (Optional)
      </label>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setActiveTab('standard')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
            ${activeTab === 'standard'
              ? 'bg-[var(--accent-start)] text-white shadow-md'
              : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-base)] border border-[var(--border-medium)]'
            }`}
        >
          Standard
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-start)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
            ${activeTab === 'custom'
              ? 'bg-[var(--accent-start)] text-white shadow-md'
              : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-base)] border border-[var(--border-medium)]'
            }`}
        >
          Custom Upload
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'standard' ? (
        <div className="space-y-3">
          {/* Standard Logo Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {STANDARD_LOGOS.map((standardLogo) => {
              const isSelected = selectedLogoId === standardLogo.id;
              return (
                <button
                  key={standardLogo.id}
                  type="button"
                  onClick={() => handleStandardLogoSelect(standardLogo.id, standardLogo.getDataURL())}
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
                      src={standardLogo.getDataURL()}
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

          {/* Remove Logo Button (shown when a standard logo is selected) */}
          {selectedLogoId && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="w-full px-4 py-2 rounded-lg text-sm font-semibold
                bg-red-500 text-white hover:bg-red-600 transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-raised)]
                shadow-md hover:shadow-lg"
            >
              Remove Logo
            </button>
          )}
        </div>
      ) : (
        /* Custom Upload Tab */
        <LogoUploader
          logo={logo}
          onLogoChange={handleCustomLogoChange}
          qrSize={qrSize}
        />
      )}
    </div>
  );
}
