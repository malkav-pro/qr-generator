---
phase: 08-event-qr-codes
plan: 01
subsystem: qr-types
tags: [event, icalendar, ics, timezone, rfc5545]
requires: [07-complex-qr-types]
provides:
  - Event QR type with iCalendar format generation
  - UTC-only timezone handling (no VTIMEZONE complexity)
  - Cross-field validation (end time after start time)
  - EventForm component with timezone selection
affects: [09-visual-enhancements]
tech-stack:
  added:
    - ics: "^3.8.1"
    - "@vvo/tzdb": "^6.198.0"
  patterns:
    - UTC-only iCalendar generation
    - datetime-local HTML5 input with timezone selection
decisions:
  - id: utc-only-approach
    choice: Use UTC-only timestamps (no VTIMEZONE components)
    rationale: Simplifies iCalendar output, avoids VTIMEZONE complexity, browser compatibility
    alternatives: [timezones-ical-library with VTIMEZONE]
  - id: cross-field-validation
    choice: Use .refine() for end-after-start validation
    rationale: Error displays on endDate field for better UX
    alternatives: [manual validation in form]
  - id: timezone-selection
    choice: Use @vvo/tzdb for timezone dropdown with friendly names
    rationale: Provides IANA names + friendly display + city references
    alternatives: [static timezone list, Intl.supportedValuesOf]
  - id: datetime-local-input
    choice: Use HTML5 datetime-local input type
    rationale: Native browser date picker, consistent UX across platforms
    alternatives: [third-party date picker library]
key-files:
  created:
    - lib/formatters/event.ts
    - components/forms/qr-forms/EventForm.tsx
  modified:
    - lib/formatters/index.ts
    - lib/registry.ts
    - components/TypeSelector.tsx
    - package.json
    - package-lock.json
duration: 7min
completed: 2026-01-28
---

# Phase 8 Plan 01: Event QR Codes Summary

**One-liner:** iCalendar event QR codes with UTC timestamps, cross-field validation, and timezone selection via @vvo/tzdb

## What Was Built

Implemented the Event QR type with full iCalendar (RFC 5545) format generation, enabling users to create scannable calendar events. Key features:

- **Event schema**: 6 fields (title, location, description, startDate, endDate, timezone) with cross-field validation preventing end time before start time
- **iCalendar formatter**: Uses `ics` library to generate RFC 5545 compliant output with UTC timestamps (Z suffix)
- **EventForm component**: React Hook Form integration with timezone select dropdown, datetime-local inputs, and character counter
- **UTC-only approach**: Converts local datetime + timezone to UTC for iCalendar output, avoiding VTIMEZONE complexity

## Tasks Completed

| Task | Description | Commit | Status |
|------|-------------|--------|--------|
| 1 | Install ics and @vvo/tzdb dependencies | 24bc1dc | ✓ Complete |
| 2 | Create event schema and formatter | 7698b93 | ✓ Complete |
| 3 | Export event type and create EventForm | ebe1447 | ✓ Complete |

## Technical Implementation

**Event Schema Pattern:**
- Co-located schema + formatter following established vCard pattern
- Cross-field validation via `.refine()` for end-after-start check
- Error displays on `endDate` field for clear UX feedback

**iCalendar Generation:**
```typescript
// Convert local datetime + timezone to UTC array for ics library
const startUtc = dateToUtcArray(new Date(`${data.startDate}:00`));
const endUtc = dateToUtcArray(new Date(`${data.endDate}:00`));

// Generate with ics library
const result = createEvent({
  start: startUtc,
  end: endUtc,
  title: data.title,
  uid: crypto.randomUUID(),
  startInputType: 'utc',
  startOutputType: 'utc',
  // ... other fields
});
```

**Timezone Handling:**
- Used `@vvo/tzdb` for timezone selection with friendly names
- Dropdown shows: `12:34 PM - America/New_York (EST)`
- Browser converts local datetime to UTC via JavaScript Date API

**Form Component:**
- HTML5 `datetime-local` input for native date/time picker
- Timezone `select` dropdown with 400+ IANA timezones
- Character counter estimates iCalendar size (200 base + field lengths)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] TypeSelector missing event label**
- **Found during:** Task 3 (TypeScript compilation)
- **Issue:** TypeSelector.tsx typeLabels Record missing 'event' key after QR_TYPES update
- **Fix:** Added `event: 'Event'` to typeLabels object
- **Files modified:** components/TypeSelector.tsx
- **Commit:** ebe1447

**2. [Rule 3 - Blocking] Registry missing EventForm component**
- **Found during:** Task 3 (TypeScript compilation)
- **Issue:** qrFormRegistry Record missing 'event' entry, blocking build
- **Fix:** Created EventForm component following VCardForm pattern, registered in qrFormRegistry
- **Files modified:** components/forms/qr-forms/EventForm.tsx, lib/registry.ts
- **Commit:** ebe1447

Both deviations were essential blocking fixes - TypeScript compilation would fail without completing the type definitions and registry mappings after adding 'event' to QR_TYPES array.

## Verification Results

All verification criteria passed:

1. ✓ `npm run build` succeeds with no errors
2. ✓ `eventSchema.safeParse()` validates complete event data correctly
3. ✓ `eventSchema.safeParse()` rejects end time before start time with error on endDate field
4. ✓ `formatEvent()` returns string starting with `BEGIN:VCALENDAR` and ending with `END:VCALENDAR`
5. ✓ Output contains `DTSTART:` and `DTEND:` with `Z` suffix (UTC format)
6. ✓ Output contains `UID:` with UUID v4 format (via crypto.randomUUID)

Additional verification:
- iCalendar output includes SUMMARY, LOCATION, DESCRIPTION, DTSTAMP
- Character counter provides accurate estimation
- Cross-field validation displays error on endDate field when end < start

## Integration Points

**Type Registry:**
- EventForm registered in `qrFormRegistry`
- QR_TYPES array now includes 'event' (8 types total)
- TypeSelector displays "Event" button

**Dependencies:**
- `ics`: Browser-compatible iCalendar generation (no Node.js dependencies)
- `@vvo/tzdb`: 400+ IANA timezones with friendly names and abbreviations

**Formatter Pattern:**
- Follows established co-located schema + formatter pattern from vCard (Phase 7)
- Character counter function for QR size estimation
- UTC-only approach avoids browser compatibility issues with VTIMEZONE

## Next Phase Readiness

**Phase 9 (Visual Enhancements):**
- Event QR type ready for form icon additions
- Character counter can benefit from enhanced size warnings
- Timezone dropdown could use visual grouping by region

**No blockers identified.**

---

**Duration:** 7 minutes
**Completed:** 2026-01-28

All tasks completed successfully. Event QR type fully functional with iCalendar generation, cross-field validation, and timezone selection.
