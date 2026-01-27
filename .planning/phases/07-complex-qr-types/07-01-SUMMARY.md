---
phase: 07-complex-qr-types
plan: 01
subsystem: qr-types
tags: [vcard, rfc2426, contact-card, form-validation, zod, react-hook-form]

# Dependency graph
requires:
  - phase: 05-form-system-foundation
    provides: RHF+Zod pattern, FormFieldSet component, qrFormRegistry
  - phase: 06-simple-qr-types
    provides: WhatsApp E.164 validation pattern, WiFi form structure
provides:
  - vCard QR code type with 8-field contact form
  - Manual RFC 2426 vCard 3.0 generation (no Node.js dependencies)
  - Character counter with warning thresholds (1400/1500 chars)
  - vCard schema with validation for name, phone, email, website, company, title, department
affects: [08-event-qr-types, visual-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Manual spec implementation to avoid browser incompatibility (vcards-js → custom RFC 2426)
    - Character counter with warning levels for QR size management

key-files:
  created:
    - lib/formatters/vcard.ts
    - components/forms/qr-forms/VCardForm.tsx
  modified:
    - lib/formatters/index.ts
    - components/forms/qr-forms/index.ts
    - lib/registry.ts
    - components/TypeSelector.tsx

key-decisions:
  - "Replaced vcards-js with manual RFC 2426 implementation to avoid Node.js fs module in browser"
  - "Character counter warns at 1400+ (amber) and 1500+ (red) to prevent unscannable QR codes"
  - "Reused E.164 phone validation pattern from WhatsApp type"

patterns-established:
  - "Manual spec implementation pattern for browser-incompatible libraries"
  - "Real-time character counting with useMemo for performance"

# Metrics
duration: 5min
completed: 2026-01-28
---

# Phase 7 Plan 1: vCard QR Type Summary

**RFC 2426 compliant vCard 3.0 generation with 8-field contact form, real-time character counter with size warnings**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-27T22:50:08Z
- **Completed:** 2026-01-27T22:55:14Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- vCard QR code type with firstName*, lastName*, phone, email, website, company, title, department fields
- Manual RFC 2426 vCard 3.0 string generation avoiding Node.js dependencies in browser
- Real-time character counter with amber warning at 1400+ chars, red warning at 1500+ chars
- Full integration with QR type system (registry, TypeSelector, formatters)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install vcards-js and Create vCard Schema + Formatter** - `a08deb8` (feat)
2. **Task 2: Create VCardForm Component with Character Counter** - `d8569e1` (feat)
3. **Task 3: Register vCard Type in System** - `a897797` (feat)

## Files Created/Modified
- `lib/formatters/vcard.ts` - vCard schema (8 fields), formatVCard() with manual RFC 2426 generation, getVCardCharacterCount() helper
- `components/forms/qr-forms/VCardForm.tsx` - 8-field form with required/optional sections, character counter with warning levels
- `lib/formatters/index.ts` - Export vCard formatter, add 'vcard' to QR_TYPES
- `components/forms/qr-forms/index.ts` - Export VCardForm
- `lib/registry.ts` - Register VCardForm in qrFormRegistry
- `components/TypeSelector.tsx` - Add 'vCard' label

## Decisions Made

**1. Manual RFC 2426 implementation instead of vcards-js**
- **Rationale:** vcards-js uses Node.js 'fs' module which fails in browser/Next.js build
- **Solution:** Implemented manual vCard 3.0 string generation with proper escaping
- **Format:** `BEGIN:VCARD\r\nVERSION:3.0\r\n...fields...\r\nEND:VCARD`
- **Escaping:** Backslash, semicolon, comma, newline per RFC 2426

**2. Character counter warning thresholds**
- **1400+ chars:** Amber warning "Approaching QR code size limit"
- **1500+ chars:** Red warning "QR code may be difficult to scan"
- **Implementation:** useMemo for performance, getVCardCharacterCount() estimates for partial data

**3. Reused E.164 validation pattern**
- **Pattern:** `/^\+[1-9]\d{6,14}$/` from WhatsApp type
- **Consistency:** Same phone validation across all QR types

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Replaced vcards-js with manual implementation**
- **Found during:** Task 3 (Type registration)
- **Issue:** vcards-js import caused Next.js build error "Module not found: Can't resolve 'fs'" - library uses Node.js fs module for saveToFile() which isn't tree-shakeable
- **Fix:** Removed vcards-js import, implemented manual vCard 3.0 string generation following RFC 2426 spec
- **Files modified:** lib/formatters/vcard.ts
- **Verification:** Build passes, vCard output matches RFC 2426 format with proper CRLF line endings
- **Committed in:** a897797 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** vcards-js replacement was necessary to unblock build. Manual implementation is simpler, has no dependencies, and produces identical RFC 2426 compliant output.

## Issues Encountered
- vcards-js library incompatible with Next.js browser environment (uses Node.js fs module) - resolved by implementing RFC 2426 spec manually

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- vCard QR type complete and fully functional
- Character counter pattern established for complex types with size constraints
- Manual spec implementation pattern can be applied to event types (iCalendar RFC 5545) if similar library issues arise
- Ready for Phase 7 Plan 2 (Event QR Types) or Phase 8 (Visual Enhancements)

---
*Phase: 07-complex-qr-types*
*Completed: 2026-01-28*
