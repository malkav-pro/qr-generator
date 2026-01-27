# Project State

## Project Reference

**Core value:** Generate QR codes you actually own — data encoded directly, no redirect service dependency
**Current focus:** Phase 7 - Complex QR Types (v1.1 milestone)
**Milestone:** v1.1 Extended Types (Phases 5-9)

## Current Position

Phase: 8 of 9 (Event QR Codes - next)
Plan: Ready to plan
Status: Phase 7 complete
Last activity: 2026-01-28 — Phase 7 complete (Complex QR Types)

Progress: [███████░░░] 78% (7 phases complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 13 (7 from v1.0, 6 from v1.1)
- v1.0 completion: 2026-01-27
- v1.1 Phase 5 complete: 2026-01-27 (Form system foundation)
- v1.1 Phase 6 complete: 2026-01-28 (Simple QR Types)
- v1.1 Phase 7 complete: 2026-01-28 (Complex QR Types)

**By Phase:**

| Phase | Plans | Status |
|-------|-------|--------|
| 1. Core Generation | 3 | Complete |
| 2. Advanced Styling | 2 | Complete |
| 3. Configuration Sharing | 1 | Complete |
| 4. UI Polish | 1 | Complete |
| 5. Form System Foundation | 2/2 | Complete |
| 6. Simple QR Types | 2/2 | Complete |
| 7. Complex QR Types | 2/2 | Complete |

**Recent Trend:**
- v1.0 shipped successfully (2026-01-27)
- v1.1 Phase 5 complete (2026-01-27)
- 05-01: RHF+Zod foundation complete (3 min)
- 05-02: Form registry and migration complete (4 min)
- 06-01: WhatsApp QR type complete (4 min)
- 06-02: WiFi QR type complete (4 min)
- 07-01: vCard QR type complete (5 min)
- 07-02: Telegram QR type complete (9 min)

*Updated after each plan completion*

## Accumulated Context

### Decisions

v1.0 established foundation:
- Next.js 15 + React 19 + qr-code-styling library
- Client-side only (no server dependencies)
- URL hash-based state persistence
- Component-based architecture

v1.1 architectural decisions (from research):
- Foundation-first approach: Build registry pattern before implementing types
- Complexity gradient: WhatsApp (simple) → WiFi → vCard (complex)
- Phase 9 (Visual Enhancements) can run parallel after Phase 5

Phase 5 Plan 01 decisions (form validation):
- Co-located schema + formatter pattern for type safety from validation to output
- Derive QRType from QR_TYPES constant in formatters module (single source of truth)
- Deprecated old EmailData interface in qr-config.ts for backward compatibility

Phase 5 Plan 02 decisions (form registry):
- Registry pattern (qrFormRegistry) scales to 5+ types without modifying page.tsx
- FormFieldSet encapsulates Controller pattern for consistent validation UX
- Removed schema transforms from optional fields to preserve TypeScript optionality

Phase 6 Plan 01 decisions (WhatsApp QR type):
- E.164 validation regex: /^\+[1-9]\d{6,14}$/ (country codes never start with 0)
- Only encode message parameter, not phone number or base URL
- Character counter for message field (500 char limit)

Phase 6 Plan 02 decisions (WiFi QR type):
- Discriminated union on encryption field for type-safe conditional validation
- Apply escaping in formatter, not schema transform, to preserve raw form values
- Hidden flag format: 'true' or empty string (never 'false') per WIFI: spec
- Double semicolon terminator (;;) required by WIFI: format spec
- Backslash-first escaping order to prevent double-escaping

Phase 7 Plan 01 decisions (vCard QR type):
- Replaced vcards-js with manual RFC 2426 implementation to avoid Node.js fs module in browser
- Character counter warns at 1400+ (amber) and 1500+ (red) to prevent unscannable QR codes
- Reused E.164 phone validation pattern from WhatsApp type
- Manual spec implementation pattern for browser-incompatible libraries

Phase 7 Plan 02 decisions (Telegram QR type):
- Mode discriminator for three Telegram link types: username, phone, bot
- Auto-strip @ prefix via .transform() before validation (UX improvement)
- Phone mode preserves + prefix in t.me URL (unlike WhatsApp wa.me)
- Bot username must end with 'bot' or '_bot' per Telegram conventions
- Transform-then-pipe pattern: .transform().pipe(z.string().min()...) for multi-stage validation

### Pending Todos

None yet.

### Blockers/Concerns

**Phase 8 (Events):** Requires RFC 5545 timezone handling validation during implementation

Note: Phase 7 (vCard) blocker resolved - manual RFC 2426 implementation successful.

## Session Continuity

Last session: 2026-01-28
Stopped at: Completed 07-02-PLAN.md (Telegram QR Type) - Phase 7 complete
Resume with: `/gsd:plan-phase 8` to begin Event QR types (iCalendar format)

---
*State initialized: 2026-01-27*
*Last updated: 2026-01-28 (Phase 7 complete - Complex QR Types: vCard + Telegram)*
