'use client';

interface SectionHeaderProps {
  label: string;
  action?: React.ReactNode;
}

export function SectionHeader({ label, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
