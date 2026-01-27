'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { whatsappSchema, WhatsAppData, formatWhatsApp } from '@/lib/formatters/whatsapp';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: { phoneNumber?: string; message?: string };
};

export function WhatsAppForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm<WhatsAppData>({
    resolver: zodResolver(whatsappSchema),
    mode: 'onBlur' as const,
    defaultValues: {
      phoneNumber: initialValue?.phoneNumber || '',
      message: initialValue?.message || '',
    },
  });

  const formData = watch();

  useEffect(() => {
    if (formData.phoneNumber) {
      const result = whatsappSchema.safeParse(formData);
      if (result.success) {
        onDataChange(formatWhatsApp(result.data));
      } else {
        // Invalid data, clear preview
        onDataChange('');
      }
    } else {
      onDataChange('');
    }
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      <FormFieldSet
        control={control}
        name="phoneNumber"
        label="Phone Number"
        render={(field) => (
          <>
            <input
              {...field}
              id="phoneNumber"
              type="tel"
              placeholder="+12025550172"
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1.5">
              Include country code (e.g., +1 for USA, +44 for UK)
            </p>
          </>
        )}
      />

      <FormFieldSet
        control={control}
        name="message"
        label="Pre-filled Message"
        optional
        render={(field) => (
          <>
            <textarea
              {...field}
              id="message"
              placeholder="Hello! I'd like to chat..."
              rows={4}
              className="w-full px-3.5 py-2.5 border rounded-lg resize-none
                transition-all duration-200
                focus:outline-none"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1.5">
              {(field.value?.length || 0)}/500 characters
            </p>
          </>
        )}
      />
    </div>
  );
}
