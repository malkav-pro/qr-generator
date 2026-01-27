'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { textSchema, TextData, formatText } from '@/lib/formatters';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: string;
};

export function TextForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm<TextData>({
    resolver: zodResolver(textSchema),
    mode: 'onBlur',
    defaultValues: {
      text: initialValue || '',
    },
  });

  const formData = watch();

  useEffect(() => {
    if (formData.text) {
      const formatted = formatText({ text: formData.text });
      onDataChange(formatted);
    } else {
      onDataChange('');
    }
  }, [formData, onDataChange]);

  return (
    <FormFieldSet
      control={control}
      name="text"
      label="Text"
      render={(field) => (
        <textarea
          {...field}
          id="text"
          placeholder="Enter any text..."
          rows={4}
          className="w-full px-3.5 py-2.5 border rounded-lg resize-none
            transition-all duration-200
            focus:outline-none"
        />
      )}
    />
  );
}
