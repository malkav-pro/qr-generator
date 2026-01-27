'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { emailSchema, EmailData, formatEmail } from '@/lib/formatters';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: { to?: string; subject?: string; body?: string };
};

export function EmailForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm({
    resolver: zodResolver(emailSchema),
    mode: 'onBlur' as const,
    defaultValues: {
      to: initialValue?.to || '',
      subject: initialValue?.subject || '',
      body: initialValue?.body || '',
    },
  });

  const formData = watch();

  useEffect(() => {
    if (formData.to) {
      try {
        const formatted = formatEmail(formData);
        onDataChange(formatted);
      } catch {
        // Invalid data, send raw mailto
        onDataChange(`mailto:${formData.to}`);
      }
    } else {
      onDataChange('');
    }
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <FormFieldSet
        control={control}
        name="to"
        label="To"
        render={(field) => (
          <input
            {...field}
            id="to"
            type="email"
            placeholder="recipient@example.com"
            className="w-full px-3.5 py-2.5 h-11 border rounded-lg
              transition-all duration-200
              focus:outline-none"
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="subject"
        label="Subject"
        optional
        render={(field) => (
          <input
            {...field}
            id="subject"
            type="text"
            placeholder="Email subject"
            className="w-full px-3.5 py-2.5 h-11 border rounded-lg
              transition-all duration-200
              focus:outline-none"
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="body"
        label="Body"
        optional
        render={(field) => (
          <textarea
            {...field}
            id="body"
            placeholder="Email body"
            rows={4}
            className="w-full px-3.5 py-2.5 border rounded-lg resize-none
              transition-all duration-200
              focus:outline-none"
          />
        )}
      />
    </div>
  );
}
