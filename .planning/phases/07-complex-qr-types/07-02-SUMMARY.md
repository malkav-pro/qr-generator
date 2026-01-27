---
phase: 07-complex-qr-types
plan: 02
subsystem: qr-types
tags: [telegram, zod, react-hook-form, discriminated-union, t.me]

# Dependency graph
requires:
  - phase: 05-form-system-foundation
    provides: RHF+Zod foundation, FormFieldSet component, form registry pattern
  - phase: 06-simple-qr-types
    provides: WhatsApp E.164 validation pattern, WiFi discriminated union pattern
provides:
  - Telegram QR type with username/phone/bot modes
  - Mode-based discriminated union schema pattern
  - Auto-stripping @ prefix transform pattern
  - t.me deep link URL generation
affects: [08-event-qr-types, future-messaging-types]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Mode-based discriminated union (extends WiFi encryption pattern)
    - Transform-then-validate pattern for @ symbol stripping
    - Conditional form fields based on discriminator value

key-files:
  created:
    - lib/formatters/telegram.ts
    - components/forms/qr-forms/TelegramForm.tsx
  modified:
    - lib/formatters/index.ts
    - components/forms/qr-forms/index.ts
    - lib/registry.ts
    - components/TypeSelector.tsx

key-decisions:
  - "Mode discriminator for three Telegram link types: username, phone, bot"
  - "Auto-strip @ prefix via .transform() before validation (UX improvement)"
  - "Phone mode preserves + prefix in t.me URL (unlike WhatsApp wa.me)"
  - "Bot username must end with 'bot' or '_bot' per Telegram conventions"
  - "E.164 phone validation reused from WhatsApp pattern"

patterns-established:
  - "Transform-then-pipe pattern: .transform().pipe(z.string().min()...) for multi-stage validation"
  - "Conditional form field rendering based on watch('mode') discriminator"
  - "Inline hint text using <p className='text-xs text-[var(--text-muted)]'> below inputs"

# Metrics
duration: 9min
completed: 2026-01-28
---

# Phase 7 Plan 2: Telegram QR Type Summary

**Telegram QR type with username/phone/bot discriminated union modes, @ auto-stripping, and t.me deep link generation**

## Performance

- **Duration:** 9 min
- **Started:** 2026-01-27T22:50:08Z
- **Completed:** 2026-01-27T22:59:09Z
- **Tasks:** 3 (1 pre-existing, 1 pre-created, 1 completed)
- **Files modified:** 6

## Accomplishments
- Telegram discriminated union schema with three modes (username, phone, bot)
- TelegramForm component with mode selector and conditional field rendering
- Automatic @ symbol stripping via transform before validation
- Bot username suffix validation enforcing Telegram conventions
- Full integration into QR type system (registry, type selector, exports)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Telegram schema + formatter** - (pre-existing in commit a897797)
2. **Task 2: Create TelegramForm component** - (pre-created in commit b7e1d25)
3. **Task 3: Register Telegram type in system** - `133a05c` (feat)

**Note:** Tasks 1 and 2 were already implemented in previous commits but not registered. This plan completed the registration step.

## Files Created/Modified
- `lib/formatters/telegram.ts` - Telegram discriminated union schema with username/phone/bot modes, @ auto-stripping, bot suffix validation, t.me URL formatter
- `components/forms/qr-forms/TelegramForm.tsx` - Mode selector form with conditional fields (username/phone/bot), inline hint text, real-time QR preview
- `lib/formatters/index.ts` - Added Telegram exports and 'telegram' to QR_TYPES array
- `components/forms/qr-forms/index.ts` - Exported TelegramForm component
- `lib/registry.ts` - Registered TelegramForm in qrFormRegistry
- `components/TypeSelector.tsx` - Added 'Telegram' label to type selector

## Decisions Made

**Mode discriminator choice:**
- Three modes cover all Telegram deep link use cases (username for users, phone for contacts, bot for bot interactions)
- Discriminated union ensures type-safe validation per mode

**@ symbol auto-stripping:**
- Transform applied BEFORE validation (.transform().pipe()) so users can input "@username" or "username"
- Makes 5-character minimum check work on actual username length (not including @)
- Improves UX - users familiar with Telegram's @ convention won't get validation errors

**Phone URL format difference:**
- t.me keeps + prefix in URL (t.me/+12025550172) unlike WhatsApp wa.me which strips it
- E.164 validation pattern reused from WhatsApp (verified working)

**Bot suffix enforcement:**
- All Telegram bots must end with "bot" or "_bot" per platform conventions
- Case-insensitive validation (val.toLowerCase().endsWith())
- Provides helpful error message guiding users to correct format

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed VCardForm hint prop error**
- **Found during:** Task 1 (while fixing blocking TypeScript errors)
- **Issue:** VCardForm.tsx was using `hint` prop on FormFieldSet, but that prop doesn't exist in component definition. This caused TypeScript compilation to fail.
- **Fix:** Removed `hint="E.164 format with country code"` prop from phoneNumber field in VCardForm.tsx (line 108)
- **Files modified:** components/forms/qr-forms/VCardForm.tsx
- **Verification:** Build passed after fix, TypeScript errors cleared
- **Note:** Linter also added `optional` props to other fields (correct behavior)

**2. [Rule 3 - Blocking] useURLState hook return type mismatch**
- **Found during:** Task 1 (while verifying build)
- **Issue:** useURLState hook returned object with {restoreFromURL, updateURL} but page.tsx called it without capturing return value, expecting void
- **Fix:** Linter automatically fixed by changing return type to void and removing unused return object
- **Files modified:** hooks/useURLState.ts (auto-fixed by linter)
- **Verification:** Build passed, no TypeScript errors

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes were necessary to unblock TypeScript compilation and build. VCardForm hint prop was from previous plan (07-01). No scope creep - only correctness fixes.

## Issues Encountered

**Pre-existing implementation:**
- telegram.ts and TelegramForm.tsx were already created in previous commits (a897797 and b7e1d25), likely accidentally committed with 07-01 plan
- Task 3 (registration) was the only remaining work
- No functional issues - existing implementation matched plan specification exactly

**Test file errors:**
- Pre-existing TypeScript errors in qr-generation.test.ts and svg-export.test.ts (missing QRConfig properties)
- Not related to Telegram implementation, did not block build
- Build system properly excludes test errors from production build

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 8 (Event QR Types):**
- All Phase 7 complex types complete (vCard, Telegram)
- Discriminated union pattern established and proven
- Form registry scales seamlessly to additional types
- Type selector UI accommodates 7 types without crowding

**Established patterns for Phase 8:**
- Discriminated union for event types (calendar, reminder, etc.)
- RFC 5545 iCalendar format (similar to vCard RFC approach)
- Conditional field rendering based on event type

**No blockers or concerns**

---
*Phase: 07-complex-qr-types*
*Completed: 2026-01-28*
