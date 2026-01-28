import { z } from 'zod';
import { createEvent, type EventAttributes } from 'ics';

// Event schema with 6 fields and cross-field validation
export const eventSchema = z.object({
  // Required fields
  title: z.string()
    .min(1, 'Event title is required')
    .max(100, 'Event title must be 100 characters or less'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Start date must be in format YYYY-MM-DDTHH:mm'),
  endDate: z.string()
    .min(1, 'End date is required')
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'End date must be in format YYYY-MM-DDTHH:mm'),
  timezone: z.string()
    .min(1, 'Timezone is required'),

  // Optional fields
  location: z.string()
    .max(200, 'Location must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End time must be after start time',
  path: ['endDate'],
});

export type EventData = z.infer<typeof eventSchema>;

// Format event data as iCalendar/ICS string
export function formatEvent(data: EventData): string {
  // Convert local datetime + timezone to UTC for ics library
  // Parse ISO 8601 datetime-local format (YYYY-MM-DDTHH:mm)
  const startLocalDate = new Date(`${data.startDate}:00`); // Add seconds for full ISO format
  const endLocalDate = new Date(`${data.endDate}:00`);

  // Convert to UTC components (ics library expects array format)
  // Array format: [year, month (1-12), day, hour, minute]
  const startUtc = dateToUtcArray(startLocalDate);
  const endUtc = dateToUtcArray(endLocalDate);

  // Create event attributes
  const eventAttributes: EventAttributes = {
    start: startUtc,
    end: endUtc,
    title: data.title,
    description: data.description && data.description.trim() ? data.description : undefined,
    location: data.location && data.location.trim() ? data.location : undefined,
    uid: crypto.randomUUID(), // Native browser API for UUID generation
    startInputType: 'utc',
    startOutputType: 'utc',
    endInputType: 'utc',
    endOutputType: 'utc',
  };

  // Generate iCalendar string
  const result = createEvent(eventAttributes);

  if (result.error) {
    throw new Error(`Failed to create iCalendar event: ${result.error.message}`);
  }

  return result.value || '';
}

// Convert Date object to UTC array format for ics library
// Returns [year, month (1-12), day, hour, minute]
function dateToUtcArray(date: Date): [number, number, number, number, number] {
  return [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1, // JavaScript months are 0-11, ics expects 1-12
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  ];
}

// Get character count for event data (supports partial data for real-time counting)
export function getEventCharacterCount(data: Partial<EventData>): number {
  try {
    // If we have valid complete data, get exact count
    const result = eventSchema.safeParse(data);
    if (result.success) {
      return formatEvent(result.data).length;
    }

    // For incomplete data, estimate using field lengths + 200 overhead
    // iCalendar overhead includes: BEGIN:VCALENDAR, VERSION, PRODID, BEGIN:VEVENT,
    // UID, DTSTAMP, DTSTART, DTEND, field labels, CRLF, END:VEVENT, END:VCALENDAR
    let estimate = 200; // Base overhead

    if (data.title) estimate += data.title.length;
    if (data.location) estimate += data.location.length;
    if (data.description) estimate += data.description.length;

    return estimate;
  } catch (error) {
    return 0;
  }
}
