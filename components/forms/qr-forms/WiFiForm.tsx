'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { wifiSchema, type WiFiData, formatWiFi } from '@/lib/formatters/wifi';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: { encryption?: string; ssid?: string; password?: string; hidden?: boolean };
};

export function WiFiForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm({
    resolver: zodResolver(wifiSchema),
    mode: 'onChange' as const,
    defaultValues: {
      encryption: (initialValue?.encryption as 'WPA' | 'WEP' | 'nopass') || 'WPA',
      ssid: initialValue?.ssid || '',
      password: initialValue?.password || '',
      hidden: initialValue?.hidden || false,
    },
  });

  const formData = watch();
  const encryption = watch('encryption');
  const needsPassword = encryption !== 'nopass';

  useEffect(() => {
    const result = wifiSchema.safeParse(formData);
    if (result.success) {
      const formatted = formatWiFi(result.data);
      onDataChange(formatted);
    } else {
      // Invalid data, clear preview
      onDataChange('');
    }
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <FormFieldSet
        control={control}
        name="ssid"
        label="Network Name (SSID)"
        render={(field) => (
          <input
            {...field}
            id="ssid"
            type="text"
            placeholder="MyHomeNetwork"
            maxLength={32}
            className="w-full px-3.5 py-2.5 h-11 border rounded-lg
              transition-all duration-200
              focus:outline-none"
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="encryption"
        label="Security Type"
        render={(field) => (
          <select
            {...field}
            id="encryption"
            className="w-full px-3.5 py-2.5 h-11 border rounded-lg
              transition-all duration-200
              focus:outline-none"
          >
            <option value="WPA">WPA/WPA2 (recommended)</option>
            <option value="WEP">WEP (legacy)</option>
            <option value="nopass">Open Network (no password)</option>
          </select>
        )}
      />

      {needsPassword && (
        <FormFieldSet
          control={control}
          name="password"
          label="Password"
          render={(field) => (
            <input
              {...field}
              id="password"
              type="password"
              placeholder={
                encryption === 'WPA'
                  ? 'Minimum 8 characters'
                  : 'Exactly 5 or 13 characters'
              }
              maxLength={63}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />
      )}

      <FormFieldSet
        control={control}
        name="hidden"
        label="Hidden Network"
        render={(field) => (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-medium)]
                text-[var(--accent-start)] focus:ring-[var(--accent-start)]"
            />
            <span className="text-sm text-[var(--text-secondary)]">
              This is a hidden network
            </span>
          </label>
        )}
      />
    </div>
  );
}
