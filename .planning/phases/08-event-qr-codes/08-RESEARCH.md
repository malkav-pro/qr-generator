# Phase 8: Event QR Codes - Research

**Researched:** 2026-01-28
**Domain:** iCalendar (RFC 5545) event generation for QR codes
**Confidence:** HIGH

## Summary

Event QR codes encode calendar events in iCalendar format (RFC 5545), specifically the VEVENT component. The standard approach uses the `ics` npm library for browser-compatible iCalendar generation, with manual timezone handling via IANA timezone database. The critical challenge is timezone correctness across devices - events must include proper TZID parameters with matching VTIMEZONE components, or use UTC time exclusively.

The established pattern in this codebase (from Phases 6-7) is co-located schema + formatter in `/lib/formatters/event.ts`, with Zod validation for type safety and manual format implementation to avoid Node.js dependencies in the browser. For events, the key technical decisions are: (1) whether to include VTIMEZONE components or use UTC-only times, (2) how to provide timezone selection UX, and (3) validation to prevent end-before-start errors.

**Primary recommendation:** Use `ics` library (v3.8+) with UTC-only time values to avoid VTIMEZONE complexity, provide timezone selection via `@vvo/tzdb` for display purposes, and use Zod `.refine()` for cross-field date comparison validation.

## Standard Stack

The established libraries/tools for iCalendar event generation in browsers:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `ics` | 3.8.1+ | iCalendar/ICS file generation | Browser-compatible, no Node.js dependencies, RFC 5545 compliant, widely adopted |
| `zod` | 4.3.6 (existing) | Schema validation with cross-field refinement | Already in project, supports `.refine()` for date comparison |
| `@vvo/tzdb` | Latest | IANA timezone database with simplified names | Lightweight, auto-updated, includes city names for UX |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `crypto.randomUUID()` | Native browser API | UUID v4 generation for UID field | Modern browsers (Chrome 92+, Safari 15.4+, Firefox 95+) - no library needed |
| `timezones-ical-library` | Latest | VTIMEZONE component generation | Only if VTIMEZONE components are required (adds complexity) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `ics` | `ical-generator` | ical-generator supports VTIMEZONE auto-generation but requires date library (Day.js/Luxon/moment) |
| `ics` | Manual RFC 5545 implementation | Following vCard pattern from Phase 7, but iCalendar is more complex (CRLF folding, VTIMEZONE) |
| `@vvo/tzdb` | `Intl.supportedValuesOf('timeZone')` | Native API provides raw IANA names but no grouping, city names, or friendly alternatives |
| UTC-only | VTIMEZONE components | VTIMEZONE adds 50-200 lines per timezone, risks interoperability issues with Outlook/Exchange |

**Installation:**
```bash
npm install ics @vvo/tzdb
```

## Architecture Patterns

### Recommended Project Structure
```
lib/formatters/
├── event.ts              # Schema + formatter + character counter
└── index.ts              # Re-export eventSchema, EventData, formatEvent

components/forms/qr-forms/
└── EventForm.tsx         # Form with date/time pickers, timezone selector

lib/types/
└── (no changes needed)
```

### Pattern 1: UTC-Only Time Values (Recommended)
**What:** Generate iCalendar events with all times in UTC (Z suffix), no VTIMEZONE components
**When to use:** When cross-device compatibility is more important than displaying local times in calendar apps
**Example:**
```typescript
// Source: RFC 5545 Section 3.3.5 + ics library patterns
import { createEvent } from 'ics';

const event = {
  start: [2026, 2, 15, 14, 30],  // Array format: [year, month, day, hour, minute]
  startInputType: 'utc',          // CRITICAL: Force UTC output
  startOutputType: 'utc',
  end: [2026, 2, 15, 15, 30],
  endInputType: 'utc',
  endOutputType: 'utc',
  title: 'Team Meeting',
  description: 'Q1 Planning Session',
  location: 'Conference Room A',
  uid: crypto.randomUUID(),       // Native browser API
  // No timezone field - all times are UTC
};

createEvent(event, (error, value) => {
  if (error) {
    console.error(error);
    return;
  }
  // value is RFC 5545 compliant iCalendar string
  console.log(value);
});
```

**Output format:**
```
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:adamgibbons/ics
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
BEGIN:VEVENT
UID:f3e4d5c6-7890-1234-5678-90abcdef1234
SUMMARY:Team Meeting
DTSTAMP:20260128T120000Z
DTSTART:20260215T143000Z
DTEND:20260215T153000Z
DESCRIPTION:Q1 Planning Session
LOCATION:Conference Room A
END:VEVENT
END:VCALENDAR
```

### Pattern 2: Co-Located Schema + Formatter
**What:** Zod schema with cross-field validation in same file as formatter function
**When to use:** Following established project pattern from Phases 5-7
**Example:**
```typescript
// Source: Established pattern in lib/formatters/whatsapp.ts, wifi.ts, vcard.ts
import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  location: z.string().max(200).optional().or(z.literal('')),
  description: z.string().max(500).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'), // ISO 8601: YYYY-MM-DDTHH:mm
  endDate: z.string().min(1, 'End date is required'),
  timezone: z.string().min(1, 'Timezone is required'), // IANA format: America/New_York
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End time must be after start time',
  path: ['endDate'], // Error appears on endDate field
});

export type EventData = z.infer<typeof eventSchema>;

export function formatEvent(data: EventData): string {
  // Convert to ics library format and generate iCalendar string
}
```

### Pattern 3: Timezone Selector Component
**What:** Searchable dropdown with grouped timezones using `@vvo/tzdb`
**When to use:** For timezone field in EventForm
**Example:**
```typescript
// Source: @vvo/tzdb documentation + Headless UI patterns from project
import { getTimeZones } from '@vvo/tzdb';
import { Combobox } from '@headlessui/react';

function TimezoneSelector({ value, onChange }) {
  const timezones = getTimeZones({ includeUtc: true });

  return (
    <Combobox value={value} onChange={onChange}>
      <Combobox.Input />
      <Combobox.Options>
        {timezones.map((tz) => (
          <Combobox.Option key={tz.name} value={tz.name}>
            {tz.alternativeName} ({tz.name})
            {tz.mainCities?.length > 0 && ` - ${tz.mainCities[0]}`}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
```

**Data structure:**
```javascript
// @vvo/tzdb provides:
{
  name: "America/New_York",
  alternativeName: "Eastern Time",
  group: ["America/New_York", "America/Detroit", ...],
  continentCode: "NA",
  continentName: "North America",
  countryName: "United States",
  mainCities: ["New York City", "Philadelphia", "Jacksonville"],
  rawOffsetInMinutes: -300,
  abbreviation: "EST",
  rawFormat: "-05:00 Eastern Time - New York City, Philadelphia"
}
```

### Pattern 4: Cross-Field Date Validation
**What:** Use Zod `.refine()` to validate end time is after start time
**When to use:** Required for Success Criteria #5 (prevent end before start)
**Example:**
```typescript
// Source: Zod documentation + community patterns
const schema = z.object({
  startDate: z.string(),
  endDate: z.string(),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'End time must be after start time',
    path: ['endDate'], // Show error on endDate field
  }
);
```

### Anti-Patterns to Avoid
- **Generating VTIMEZONE without library:** VTIMEZONE components require DST transition rules, offsets, RRULE patterns - extremely complex to generate manually
- **Using deprecated `input type="datetime"`:** Removed from HTML5 spec; use `datetime-local` instead
- **Storing dates as Date objects in form state:** HTML5 `datetime-local` inputs use string format `YYYY-MM-DDTHH:mm`; keep as strings until conversion
- **Email-style UIDs:** Modern best practice is UUID v4 (use `crypto.randomUUID()`), not `event-123@example.com`

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| iCalendar generation | Manual string concatenation with template literals | `ics` library | RFC 5545 has edge cases: line folding at 75 chars, CRLF endings, escape sequences, PRODID format |
| VTIMEZONE generation | Lookup timezone rules and format manually | `timezones-ical-library` or UTC-only | Each VTIMEZONE requires DST rules, RRULE patterns, historical transitions (50-200 lines per zone) |
| UUID v4 generation | Math.random() or custom implementation | `crypto.randomUUID()` | Native API uses cryptographically secure PRNG, RFC 4122 compliant, zero dependencies |
| IANA timezone list | Manual array of timezone strings | `@vvo/tzdb` | Needs friendly names, grouping, city references, offset info - @vvo/tzdb auto-updates |
| Date string parsing for comparison | String comparison or regex | `new Date()` constructor | JavaScript Date handles ISO 8601 parsing natively, accounts for month/day/year variations |

**Key insight:** iCalendar format appears simple (key:value pairs) but has strict requirements (CRLF line breaks, 75-char folding, VTIMEZONE complexity, UID uniqueness) that libraries handle correctly. Manual implementation risks interoperability failures with calendar apps.

## Common Pitfalls

### Pitfall 1: Missing or Incorrect DTSTAMP
**What goes wrong:** DTSTAMP is REQUIRED in VEVENT but often forgotten or formatted incorrectly
**Why it happens:** DTSTAMP represents creation timestamp, separate from DTSTART (event start time)
**How to avoid:** Always generate DTSTAMP as current UTC time in format `YYYYMMDDTHHmmssZ`
**Warning signs:** Calendar apps reject import, or events show incorrect modification times
**Solution:**
```typescript
function getCurrentDTSTAMP(): string {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  // Converts: 2026-01-28T12:30:45.123Z → 20260128T123045Z
}
```

### Pitfall 2: TZID Without VTIMEZONE Component
**What goes wrong:** Using `DTSTART;TZID=America/New_York:20260215T143000` without including matching VTIMEZONE component causes events to display as "floating time" (wrong times across timezones)
**Why it happens:** RFC 5545 states: "Each unique TZID value MUST have a corresponding VTIMEZONE component"
**How to avoid:** Either (a) use UTC-only times with Z suffix, or (b) include VTIMEZONE components via library
**Warning signs:** Events import successfully but show at different times on different devices
**Recommended approach:** Use UTC-only for simplicity (avoid VTIMEZONE entirely)

### Pitfall 3: HTML datetime-local Doesn't Include Timezone
**What goes wrong:** `<input type="datetime-local">` provides no timezone information in its value
**Why it happens:** HTML5 spec explicitly states datetime-local is "local date and time (with no timezone information)"
**How to avoid:** Provide separate timezone selector; combine datetime-local value + timezone in submission
**Warning signs:** Users select local time but don't realize timezone context is missing
**Form pattern:**
```typescript
// datetime-local gives: "2026-02-15T14:30"
// Separate timezone selector gives: "America/New_York"
// Combine both to create UTC time for iCalendar
```

### Pitfall 4: Using Microsoft Timezone Names
**What goes wrong:** Microsoft uses non-standard timezone names like "Romance Standard Time" or "Eastern Standard Time" instead of IANA names
**Why it happens:** Exchange Server and Outlook have their own timezone database
**How to avoid:** Always use IANA names (America/New_York, Europe/Paris) for maximum compatibility
**Warning signs:** Events work in Outlook but fail in Google Calendar, Apple Calendar, or other apps
**Reference:** IANA timezone list at [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### Pitfall 5: QR Code Size Exceeds Scannable Limit
**What goes wrong:** Adding long description, location, VTIMEZONE components makes QR code too dense to scan
**Why it happens:** iCalendar with VTIMEZONE can easily exceed 500+ characters; QR Version 6+ requires larger print size
**How to avoid:**
- Limit description to 500 chars max
- Limit location to 200 chars max
- Use UTC-only (no VTIMEZONE) to save ~150+ chars per timezone
- Test QR codes with real devices before production
**Warning signs:** QR codes scan slowly, require multiple attempts, or fail on older devices
**Recommendation:** Keep total iCalendar output under 400 characters when possible (fits in QR Version 4-5)

### Pitfall 6: End Time Before Start Time Validation Edge Cases
**What goes wrong:** Simple string comparison `endDate > startDate` fails for same-day events with different time zones
**Why it happens:** JavaScript string comparison is lexicographic, not temporal
**How to avoid:** Always parse to Date objects before comparison: `new Date(start) < new Date(end)`
**Warning signs:** Validation allows end before start in edge cases
**Correct validation:**
```typescript
.refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End time must be after start time',
  path: ['endDate'],
})
```

## Code Examples

Verified patterns from official sources:

### Complete Event Formatter (Following Project Pattern)
```typescript
// Source: RFC 5545 + ics library docs + established project patterns
import { z } from 'zod';
import { createEvent, EventAttributes } from 'ics';

export const eventSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  location: z.string()
    .max(200, 'Location must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Invalid date format'),
  endDate: z.string()
    .min(1, 'End date is required')
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Invalid date format'),
  timezone: z.string()
    .min(1, 'Timezone is required'),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End time must be after start time',
  path: ['endDate'],
});

export type EventData = z.infer<typeof eventSchema>;

export function formatEvent(data: EventData): string {
  // Convert ISO string + timezone to UTC components for ics library
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  const event: EventAttributes = {
    start: [
      startDate.getUTCFullYear(),
      startDate.getUTCMonth() + 1, // ics library expects 1-12, not 0-11
      startDate.getUTCDate(),
      startDate.getUTCHours(),
      startDate.getUTCMinutes(),
    ],
    startInputType: 'utc',
    startOutputType: 'utc',
    end: [
      endDate.getUTCFullYear(),
      endDate.getUTCMonth() + 1,
      endDate.getUTCDate(),
      endDate.getUTCHours(),
      endDate.getUTCMinutes(),
    ],
    endInputType: 'utc',
    endOutputType: 'utc',
    title: data.title,
    description: data.description || undefined,
    location: data.location || undefined,
    uid: crypto.randomUUID(),
  };

  const result = createEvent(event);

  if (result.error) {
    throw new Error(`Failed to create event: ${result.error}`);
  }

  return result.value || '';
}
```

### Timezone Selector with Search
```typescript
// Source: @vvo/tzdb + Headless UI Combobox pattern
import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { getTimeZones } from '@vvo/tzdb';

export function TimezoneSelector({ value, onChange }) {
  const [query, setQuery] = useState('');
  const timezones = getTimeZones({ includeUtc: true });

  const filteredTimezones = query === ''
    ? timezones
    : timezones.filter((tz) => {
        const searchStr = `${tz.alternativeName} ${tz.name} ${tz.mainCities?.join(' ')}`.toLowerCase();
        return searchStr.includes(query.toLowerCase());
      });

  return (
    <Combobox value={value} onChange={onChange}>
      <Combobox.Input
        onChange={(e) => setQuery(e.target.value)}
        displayValue={(tzName) => {
          const tz = timezones.find(t => t.name === tzName);
          return tz ? `${tz.alternativeName} (${tz.name})` : tzName;
        }}
      />
      <Combobox.Options>
        {filteredTimezones.map((tz) => (
          <Combobox.Option key={tz.name} value={tz.name}>
            <span className="font-medium">{tz.alternativeName}</span>
            <span className="text-sm text-gray-500"> {tz.name}</span>
            {tz.mainCities?.[0] && (
              <span className="text-sm text-gray-400"> - {tz.mainCities[0]}</span>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
```

### Character Counter for Events
```typescript
// Source: Pattern established in lib/formatters/vcard.ts
export function getEventCharacterCount(data: Partial<EventData>): number {
  try {
    const result = eventSchema.safeParse(data);
    if (result.success) {
      return formatEvent(result.data).length;
    }

    // Estimate for incomplete data
    let estimate = 200; // iCalendar overhead (BEGIN/END blocks, PRODID, etc.)

    if (data.title) estimate += data.title.length;
    if (data.location) estimate += data.location.length;
    if (data.description) estimate += data.description.length;
    estimate += 40; // UID length (UUID v4)
    estimate += 32; // DTSTAMP + DTSTART + DTEND timestamps

    return estimate;
  } catch {
    return 0;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Email-style UIDs (`event@domain.com`) | UUID v4 via `crypto.randomUUID()` | RFC 4122 + browser API adoption ~2021 | Native browser support eliminates library dependency |
| Include `input type="datetime"` | Use `input type="datetime-local"` | HTML5 spec removal ~2016 | datetime-local is the only supported datetime input |
| Manual VTIMEZONE generation | Library-generated or UTC-only | Ongoing interoperability issues | VTIMEZONE bugs common source of calendar import failures |
| Moment.js for date handling | Native Date API + Intl | Moment maintenance mode 2020 | Smaller bundle size, native APIs sufficient for iCalendar dates |
| `uuidv4()` npm package | `crypto.randomUUID()` native | Browser support 2021-2022 | Zero dependencies, cryptographically secure |

**Deprecated/outdated:**
- **`input type="datetime"`**: Removed from HTML5 spec; use `type="datetime-local"` instead
- **Moment.js**: In maintenance mode; for event timestamps, native Date + `toISOString()` is sufficient
- **vCard-style BEGIN/END nesting**: iCalendar uses similar structure but different properties (VEVENT vs VCARD)
- **Email format UIDs**: Modern best practice uses UUID v4 for guaranteed uniqueness and no domain dependency

## Open Questions

Things that couldn't be fully resolved:

1. **VTIMEZONE vs UTC-only tradeoff**
   - What we know: UTC-only is simpler, smaller QR codes, no VTIMEZONE bugs
   - What's unclear: Does UTC-only cause user confusion when events display in device timezone?
   - Recommendation: Start with UTC-only for v1; add VTIMEZONE if users report timezone confusion

2. **ics library browser bundle size**
   - What we know: `ics` library works in browsers, no Node.js fs module
   - What's unclear: Actual minified bundle size impact (not documented in npm/GitHub)
   - Recommendation: Install and check bundle analyzer; if >50KB, consider manual implementation

3. **Optimal character limits for QR scannability**
   - What we know: QR Version 6 (~224 chars) is widely scannable; Version 10+ requires larger print
   - What's unclear: Exact breakpoints for description/location field limits
   - Recommendation: Use conservative limits (title: 100, location: 200, description: 500) and test with real devices

4. **Timezone display in QR code scanning apps**
   - What we know: Calendar apps display events in device timezone after import
   - What's unclear: Do generic QR scanner apps (not calendar apps) show event preview correctly?
   - Recommendation: Test with iOS Camera, Android default scanner, and third-party QR apps

## Sources

### Primary (HIGH confidence)
- [RFC 5545 - iCalendar Specification](https://datatracker.ietf.org/doc/html/rfc5545) - Official iCalendar standard
- [iCalendar.org - RFC 5545 Documentation](https://icalendar.org/iCalendar-RFC-5545/) - Specification reference
- [MDN: crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) - Native UUID generation
- [MDN: input type="datetime-local"](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local) - HTML5 datetime input
- [@vvo/tzdb GitHub](https://github.com/vvo/tzdb) - Timezone database library
- [ics npm package](https://www.npmjs.com/package/ics) - iCalendar generation library
- [ics GitHub repository](https://github.com/adamgibbons/ics) - Source code and examples

### Secondary (MEDIUM confidence)
- [Zod date-time validation discussion](https://github.com/colinhacks/zod/discussions/879) - Community patterns for date comparison
- [iCalendar VEVENT Component Spec](https://icalendar.org/iCalendar-RFC-5545/3-6-1-event-component.html) - VEVENT requirements
- [IANA Timezone Database Info](https://data.iana.org/time-zones/tz-link.html) - Official timezone data
- [Wikipedia: List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) - IANA timezone reference
- [Intl.Locale.getTimeZones() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTimeZones) - Native timezone API

### Tertiary (LOW confidence)
- [Scanova: Calendar QR Code Guide](https://scanova.io/blog/calendar-qr-code/) - Best practices (marketing content, not technical)
- [QR Code Character Limits](https://ryanagibson.com/extra/qr-character-limits/) - Community reference for QR capacity
- [CorrectICS: Timezone Errors](https://correctics.com/help/ics-timezone-errors-tzid-vtimezone/) - Common pitfalls (third-party troubleshooting site)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - ics library is widely used, @vvo/tzdb is actively maintained, crypto.randomUUID() is native API
- Architecture: HIGH - RFC 5545 is stable spec (2009), patterns verified in library docs and project codebase
- Pitfalls: MEDIUM - VTIMEZONE issues documented but real-world impact varies by calendar app; QR size limits are approximate

**Research date:** 2026-01-28
**Valid until:** 2026-04-28 (90 days - stable domain, RFC unchanged since 2009, libraries mature)
