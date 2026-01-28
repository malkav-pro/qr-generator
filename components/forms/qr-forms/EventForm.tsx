'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { eventSchema, type EventData, formatEvent, getEventCharacterCount } from '@/lib/formatters/event';
import { FormFieldSet } from '../FormFieldSet';
import { getTimeZones } from '@vvo/tzdb';

type Props = {
  onDataChange: (data: string) => void;
  initialValue?: Partial<EventData>;
};

// Get timezone list (memoized to avoid recreating on every render)
const timezones = getTimeZones();

export function EventForm({ onDataChange, initialValue }: Props) {
  // Get browser timezone as default
  const browserTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'America/New_York'; // Fallback if browser timezone detection fails
    }
  }, []);

  const { control, watch } = useForm({
    resolver: zodResolver(eventSchema),
    mode: 'onChange' as const,
    defaultValues: {
      title: initialValue?.title || '',
      location: initialValue?.location || '',
      description: initialValue?.description || '',
      startDate: initialValue?.startDate || '',
      endDate: initialValue?.endDate || '',
      timezone: initialValue?.timezone || browserTimezone,
    },
  });

  const formData = watch();

  // Real-time character counter
  const charCount = useMemo(() => getEventCharacterCount(formData), [formData]);

  // Warning levels for QR code size (same as VCardForm)
  const getWarningLevel = (count: number) => {
    if (count >= 1500) return 'critical';  // Red
    if (count >= 1400) return 'warning';   // Amber
    return 'normal';                       // Default
  };
  const warningLevel = getWarningLevel(charCount);

  // Update QR preview on valid data
  useEffect(() => {
    const result = eventSchema.safeParse(formData);
    if (result.success) {
      onDataChange(formatEvent(result.data));
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
          name="title"
          label="Event Title"
          render={(field) => (
            <input
              {...field}
              id="title"
              type="text"
              placeholder="Team Meeting"
              maxLength={100}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="startDate"
          label="Start Date & Time"
          render={(field) => (
            <input
              {...field}
              id="startDate"
              type="datetime-local"
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="endDate"
          label="End Date & Time"
          render={(field) => (
            <input
              {...field}
              id="endDate"
              type="datetime-local"
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="timezone"
          label="Timezone"
          render={(field) => (
            <select
              {...field}
              id="timezone"
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            >
              {timezones.map((tz) => (
                <option key={tz.name} value={tz.name}>
                  {tz.currentTimeFormat} - {tz.name} ({tz.abbreviation})
                </option>
              ))}
            </select>
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
          name="location"
          label="Location"
          optional
          render={(field) => (
            <input
              {...field}
              id="location"
              type="text"
              placeholder="Conference Room A"
              maxLength={200}
              className="w-full px-3.5 py-2.5 h-11 border rounded-lg
                transition-all duration-200
                focus:outline-none"
            />
          )}
        />

        <FormFieldSet
          control={control}
          name="description"
          label="Description"
          optional
          render={(field) => (
            <textarea
              {...field}
              id="description"
              placeholder="Quarterly planning session"
              maxLength={500}
              rows={3}
              className="w-full px-3.5 py-2.5 border rounded-lg
                transition-all duration-200
                focus:outline-none resize-none"
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
            Event size: {charCount} characters
          </div>
          {warningLevel === 'warning' && (
            <div className="text-xs text-amber-600">
              Approaching QR code size limit. Consider shortening description.
            </div>
          )}
          {warningLevel === 'critical' && (
            <div className="text-xs text-red-600">
              QR code may be difficult to scan. Shorten description or location.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
