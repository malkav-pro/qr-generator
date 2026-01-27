'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { urlSchema, UrlData, formatUrl } from '@/lib/formatters';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: string;
};

export function UrlForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm<UrlData>({
    resolver: zodResolver(urlSchema),
    mode: 'onBlur',
    defaultValues: {
      url: initialValue || '',
    },
  });

  // Watch for changes and update parent
  const formData = watch();

  useEffect(() => {
    // Only format and send if there's data
    if (formData.url) {
      try {
        // Attempt to format (validates implicitly)
        const formatted = formatUrl({ url: formData.url });
        onDataChange(formatted);
      } catch {
        // Invalid data, send raw value for preview
        onDataChange(formData.url);
      }
    } else {
      onDataChange('');
    }
  }, [formData, onDataChange]);

  return (
    <FormFieldSet
      control={control}
      name="url"
      label="URL"
      render={(field) => (
        <input
          {...field}
          id="url"
          type="text"
          placeholder="https://example.com"
          className="w-full px-3.5 py-2.5 h-11 border rounded-lg
            transition-all duration-200
            focus:outline-none"
        />
      )}
    />
  );
}
