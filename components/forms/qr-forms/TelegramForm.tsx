'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { telegramSchema, type TelegramData, formatTelegram } from '@/lib/formatters/telegram';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: { mode?: 'username' | 'phone' | 'bot'; username?: string; phoneNumber?: string; botUsername?: string };
};

export function TelegramForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm({
    resolver: zodResolver(telegramSchema),
    mode: 'onChange' as const,
    defaultValues: {
      mode: (initialValue?.mode || 'username') as 'username' | 'phone' | 'bot',
      username: initialValue?.username || '',
      phoneNumber: initialValue?.phoneNumber || '',
      botUsername: initialValue?.botUsername || '',
    },
  });

  const formData = watch();
  const mode = watch('mode');

  // QR update effect
  useEffect(() => {
    const result = telegramSchema.safeParse(formData);
    if (result.success) {
      onDataChange(formatTelegram(result.data));
    } else {
      onDataChange('');
    }
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <FormFieldSet
        control={control}
        name="mode"
        label="Link Type"
        render={(field) => (
          <select
            {...field}
            id="mode"
            className="w-full px-3.5 py-2.5 h-11 border rounded-lg
              transition-all duration-200
              focus:outline-none"
          >
            <option value="username">Username</option>
            <option value="phone">Phone Number</option>
            <option value="bot">Bot</option>
          </select>
        )}
      />

      {mode === 'username' && (
        <FormFieldSet
          control={control}
          name="username"
          label="Username"
          render={(field) => (
            <div className="space-y-1.5">
              <input
                {...field}
                id="username"
                type="text"
                placeholder="@username or username"
                maxLength={32}
                className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                  transition-all duration-200
                  focus:outline-none"
              />
              <p className="text-xs text-[var(--text-muted)]">
                5-32 characters. Letters, numbers, underscores. @ will be auto-removed.
              </p>
            </div>
          )}
        />
      )}

      {mode === 'phone' && (
        <FormFieldSet
          control={control}
          name="phoneNumber"
          label="Phone Number"
          render={(field) => (
            <div className="space-y-1.5">
              <input
                {...field}
                id="phoneNumber"
                type="tel"
                placeholder="+12025550172"
                className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                  transition-all duration-200
                  focus:outline-none"
              />
              <p className="text-xs text-[var(--text-muted)]">
                Enter phone number with country code (E.164 format)
              </p>
            </div>
          )}
        />
      )}

      {mode === 'bot' && (
        <FormFieldSet
          control={control}
          name="botUsername"
          label="Bot Username"
          render={(field) => (
            <div className="space-y-1.5">
              <input
                {...field}
                id="botUsername"
                type="text"
                placeholder="@mybotname or mybotname"
                maxLength={32}
                className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                  transition-all duration-200
                  focus:outline-none"
              />
              <p className="text-xs text-[var(--text-muted)]">
                Must end with 'bot' or '_bot'. @ will be auto-removed.
              </p>
            </div>
          )}
        />
      )}
    </div>
  );
}
