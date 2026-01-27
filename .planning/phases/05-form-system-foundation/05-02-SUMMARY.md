---
phase: 05-form-system-foundation
plan: 02
subsystem: ui
tags: [react-hook-form, zod, registry-pattern, form-validation]

# Dependency graph
requires:
  - phase: 05-01
    provides: Schema + formatter pattern with QR_TYPES constant
provides:
  - FormFieldSet component with Controller integration
  - Type-specific form components (UrlForm, TextForm, EmailForm)
  - Component registry for dynamic form rendering
  - Registry pattern replacing if/else branching
affects: [06-whatsapp, 07-wifi, 08-vcard, 09-event-icalendar]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Registry pattern for QR type to component mapping
    - Controller render prop pattern via FormFieldSet
    - Co-located validation in form components

key-files:
  created:
    - components/forms/FormFieldSet.tsx
    - components/forms/qr-forms/UrlForm.tsx
    - components/forms/qr-forms/TextForm.tsx
    - components/forms/qr-forms/EmailForm.tsx
    - lib/registry.ts
  modified:
    - components/TypeSelector.tsx
    - app/page.tsx
    - lib/formatters/email.ts

key-decisions:
  - "Registry pattern scales to 5+ new types without modifying page.tsx"
  - "FormFieldSet encapsulates Controller pattern for consistency"
  - "Removed .transform() from email schema to fix optional field types"

patterns-established:
  - "Registry pattern: qrFormRegistry maps QRTypeKey to ComponentType<QRFormProps>"
  - "FormFieldSet pattern: Consistent label/error/optional handling across all forms"
  - "Form integration: useForm + watch() + useEffect for real-time QR updates"

# Metrics
duration: 4min
completed: 2026-01-27
---

# Phase 05 Plan 02: Form Registry and Component Migration Summary

**Registry-based form system with RHF+Zod validation replacing if/else branching - ready for 5+ new QR types**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-27T21:03:14Z
- **Completed:** 2026-01-27T21:07:06Z
- **Tasks:** 3
- **Files modified:** 9 (5 created, 4 modified)

## Accomplishments
- Registry pattern enables adding new QR types without modifying page.tsx
- FormFieldSet component provides consistent validation UX across all forms
- Type-specific forms (UrlForm, TextForm, EmailForm) with real-time QR updates
- Migration complete: DataInput branching replaced with registry lookup

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FormFieldSet component** - `cfb5043` (feat)
2. **Task 2: Create type-specific forms and registry** - `cd9e22c` (feat)
3. **Task 3: Migrate to registry pattern** - `19f85b5` (feat)

## Files Created/Modified
- `components/forms/FormFieldSet.tsx` - Reusable form field wrapper with Controller integration
- `components/forms/qr-forms/UrlForm.tsx` - URL type form with RHF + Zod
- `components/forms/qr-forms/TextForm.tsx` - Text type form with RHF + Zod
- `components/forms/qr-forms/EmailForm.tsx` - Email type form with RHF + Zod (3 fields)
- `lib/registry.ts` - QR type to form component mapping (type-safe)
- `components/TypeSelector.tsx` - Updated to use QR_TYPES constant
- `app/page.tsx` - Migrated to registry pattern, removed emailData state
- `lib/formatters/email.ts` - Removed .transform() to fix optional types
- `components/index.ts` - Added new form component exports

## Decisions Made

**1. Removed schema transforms for optional fields**
- **Context:** Email schema used `.transform((val) => val || '')` on optional fields
- **Issue:** TypeScript inferred `EmailData` with required string fields, breaking optional semantics
- **Decision:** Removed transforms, let Zod handle optional fields naturally
- **Impact:** Forms handle undefined values correctly, type safety maintained

**2. Registry lookup via IIFE in JSX**
- **Pattern:** `(() => { const FormComponent = getQRForm(qrType); return <FormComponent ... />; })()`
- **Rationale:** Clean separation between lookup logic and rendering
- **Benefit:** Type-safe dynamic component rendering without conditional branching

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed email schema optional field type inference**
- **Found during:** Task 3 (Migration and build verification)
- **Issue:** Schema transforms on optional fields broke TypeScript inference, causing `EmailData` to have required `subject` and `body` fields instead of optional
- **Fix:** Removed `.transform((val) => val || '')` from subject and body schema fields
- **Files modified:** lib/formatters/email.ts, components/forms/qr-forms/EmailForm.tsx
- **Verification:** Build succeeds, EmailForm handles optional fields correctly
- **Committed in:** 19f85b5 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Bug fix necessary for correct TypeScript types. No scope creep.

## Issues Encountered
None - plan executed smoothly with one schema bug fix.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Registry pattern ready for new QR types (WhatsApp, WiFi, vCard, Events)
- FormFieldSet provides consistent validation UX foundation
- QR_TYPES constant in formatters is single source of truth for type iteration
- Adding new type: create formatter + form component + add to registry (3 touches, no page.tsx modification)

**Ready for Phase 6 (WhatsApp QR)** - first new QR type will validate registry pattern scales as designed.

---
*Phase: 05-form-system-foundation*
*Completed: 2026-01-27*
