'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { vcardSchema, type VCardData, formatVCard, getVCardCharacterCount } from '@/lib/formatters/vcard';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: Partial<VCardData>;
};

export function VCardForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm({
    resolver: zodResolver(vcardSchema),
    mode: 'onChange' as const,
    defaultValues: {
      firstName: initialValue?.firstName || '',
      lastName: initialValue?.lastName || '',
      phoneNumber: initialValue?.phoneNumber || '',
      email: initialValue?.email || '',
      website: initialValue?.website || '',
      company: initialValue?.company || '',
      title: initialValue?.title || '',
      department: initialValue?.department || '',
    },
  });

  const formData = watch();

  // Real-time character counter
  const charCount = useMemo(() => getVCardCharacterCount(formData), [formData]);

  // Warning levels for QR code size
  const getWarningLevel = (count: number) => {
    if (count >= 1500) return 'critical';  // Red
    if (count >= 1400) return 'warning';   // Amber
    return 'normal';                       // Default
  };
  const warningLevel = getWarningLevel(charCount);

  // Update QR preview on valid data
  useEffect(() => {
    const result = vcardSchema.safeParse(formData);
    if (result.success) {
      onDataChange(formatVCard(result.data));
    } else {
      onDataChange('');
    }
  }, [formData, onDataChange]);

  return (
    <div className="space-y-4">
      {/* Required fields section */}
      <div className="space-y-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Required Information
        </div>

        <FormFieldSet
          control={control}
          name="firstName"
          label="First Name"
          render={(field) => (
            <input
              {...field}
              id="firstName"
              type="text"
              placeholder="John"
              maxLength={50}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="lastName"
          label="Last Name"
          render={(field) => (
            <input
              {...field}
              id="lastName"
              type="text"
              placeholder="Doe"
              maxLength={50}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />
      </div>

      {/* Optional fields section */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Optional Information
        </div>

        <FormFieldSet
          control={control}
          name="phoneNumber"
          label="Phone Number"
          optional
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
                E.164 format with country code
              </p>
            </>
          )}
        />

        <FormFieldSet
          control={control}
          name="email"
          label="Email"
          optional
          render={(field) => (
            <input
              {...field}
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="website"
          label="Website"
          optional
          render={(field) => (
            <input
              {...field}
              id="website"
              type="url"
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="company"
          label="Company"
          optional
          render={(field) => (
            <input
              {...field}
              id="company"
              type="text"
              placeholder="ACME Corporation"
              maxLength={100}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="title"
          label="Title"
          optional
          render={(field) => (
            <input
              {...field}
              id="title"
              type="text"
              placeholder="Software Engineer"
              maxLength={100}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="department"
          label="Department"
          optional
          render={(field) => (
            <input
              {...field}
              id="department"
              type="text"
              placeholder="Engineering"
              maxLength={100}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />
      </div>

      {/* Character counter with warnings */}
      <div className="pt-4 border-t border-[var(--border-subtle)]">
        <div className="text-sm space-y-1">
          <div className={`font-medium ${
            warningLevel === 'critical' ? 'text-red-600' :
            warningLevel === 'warning' ? 'text-amber-600' :
            'text-[var(--text-secondary)]'
          }`}>
            vCard size: {charCount} characters
          </div>
          {warningLevel === 'warning' && (
            <div className="text-xs text-amber-600">
              Approaching QR code size limit. Consider removing optional fields.
            </div>
          )}
          {warningLevel === 'critical' && (
            <div className="text-xs text-red-600">
              QR code may be difficult to scan. Remove some optional fields.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
