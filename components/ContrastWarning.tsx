import { calculateContrastRatio } from '@/lib/contrast-validation';

interface ContrastWarningProps {
  foreground: string;
  background: string;
  minRatio?: number;
}

export function ContrastWarning({
  foreground,
  background,
  minRatio = 12,
}: ContrastWarningProps) {
  const ratio = calculateContrastRatio(foreground, background);
  const isGood = ratio >= minRatio;

  return (
    <div
      className={`p-4 rounded-md border-2 ${
        isGood
          ? 'bg-green-50 border-green-500'
          : 'bg-red-50 border-red-500'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-2xl ${isGood ? 'text-green-600' : 'text-red-600'}`}
        >
          {isGood ? '✓' : '⚠'}
        </span>
        <div>
          <p className="font-medium text-sm">
            Contrast Ratio: {ratio.toFixed(2)}:1
          </p>
          {isGood ? (
            <p className="text-xs text-green-700 mt-1">
              Good contrast for QR code scanning
            </p>
          ) : (
            <p className="text-xs text-red-700 mt-1">
              Warning: Low contrast may affect scanning reliability
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
