'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { validateBackgroundFile, validateImageDimensions } from '@/lib/utils/background-validation';

export interface BackgroundImagePickerProps {
  backgroundImage: string | null;
  onBackgroundImageChange: (dataURL: string | null) => void;
  backgroundOpacity: number;
  onOpacityChange: (opacity: number) => void;
}

export function BackgroundImagePicker({
  backgroundImage,
  onBackgroundImageChange,
  backgroundOpacity,
  onOpacityChange
}: BackgroundImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    // Validate file type and size FIRST
    const validation = validateBackgroundFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Read file and convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target?.result as string;

      // Validate dimensions before accepting
      const img = new Image();
      img.onload = () => {
        const dimValidation = validateImageDimensions(img.naturalWidth, img.naturalHeight);
        if (dimValidation.valid) {
          onBackgroundImageChange(dataURL);
        } else {
          alert(dimValidation.error);
        }
      };
      img.onerror = () => {
        alert('Failed to load image');
      };
      img.src = dataURL;
    };
    reader.onerror = () => {
      alert('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input value to allow re-upload
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

  const handleRemove = () => {
    onBackgroundImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Upload/Preview zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg transition-all duration-300
          ${dragActive
            ? 'border-[var(--accent-start)] bg-[var(--accent-glow)] scale-[1.01]'
            : 'border-[var(--border-medium)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-base)]'
          }
          cursor-pointer
        `}
        onClick={() => !backgroundImage && fileInputRef.current?.click()}
      >
        {backgroundImage ? (
          <div className="p-3 space-y-2">
            <img
              src={backgroundImage}
              alt="Background preview"
              className="max-h-32 mx-auto rounded"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="flex items-center gap-1.5 mx-auto text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Remove background
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-2 text-center">
            <Upload className="w-8 h-8 mx-auto text-[var(--text-secondary)]" strokeWidth={2} />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              PNG or JPG, max 5MB, max 4000x4000px
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Opacity slider - only visible when image is loaded */}
      {backgroundImage && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Background Opacity
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={backgroundOpacity * 100}
            onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
            className="w-full h-2 bg-[var(--surface-elevated)] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[var(--accent-start)]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-[var(--accent-start)]
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:shadow-lg
            "
          />
          <div className="text-xs text-[var(--text-secondary)] text-right">
            {Math.round(backgroundOpacity * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}
