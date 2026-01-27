# Roadmap: QR Code Generator

## Milestones

- **v1.0 MVP** - Phases 1-4 (shipped 2026-01-27)
- **v1.1 Extended Types** - Phases 5-9 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-4) - SHIPPED 2026-01-27</summary>

### Phase 1: Core Generation
**Goal**: User can generate basic QR codes with customization
**Requirements**: TYPE-01, TYPE-02, TYPE-03, STYLE-01, STYLE-02, EXPORT-01, PREVIEW-01, PREVIEW-02, TECH-01, TECH-02, TECH-03, TECH-04, TECH-05, UI-01, UI-04
**Success Criteria**:
  1. User can generate QR code for URL, text, and email
  2. User can customize foreground and background colors
  3. User sees real-time preview with debounced updates
  4. User can export as PNG at configurable resolution

### Phase 2: Advanced Styling
**Goal**: User can apply rich visual customization
**Requirements**: STYLE-03, STYLE-04, STYLE-05, STYLE-06, STYLE-07, EXPORT-02, UI-03, UI-05
**Success Criteria**:
  1. User can apply gradient foreground (linear/radial)
  2. User can select from 5 dot/module styles
  3. User can select corner square and dot styles
  4. User can upload and overlay center logo
  5. User can export as SVG

### Phase 3: Configuration Sharing
**Goal**: User can share QR configurations via URL
**Requirements**: SHARE-01, SHARE-02, SHARE-03
**Success Criteria**:
  1. App encodes all settings in URL hash
  2. Visiting URL with hash restores complete configuration
  3. User can copy shareable URL to clipboard

### Phase 4: UI Polish
**Goal**: Modern, polished interface via ui-designer skill
**Requirements**: UI-02
**Success Criteria**:
  1. Interface uses modern design patterns (not generic Bootstrap look)
  2. Visual hierarchy guides user through generation workflow
  3. Responsive design works smoothly on mobile and desktop

</details>

### v1.1 Extended Types (In Progress)

**Milestone Goal:** Add 5 new QR code types (vCard, WhatsApp, Telegram, Events, WiFi) with enhanced style system and logo library

#### Phase 5: Form System Foundation
**Goal**: Establish scalable patterns for complex form inputs with React Hook Form + Zod
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: Infrastructure for VCARD, WHATSAPP, TELEGRAM, EVENT, WIFI implementations
**Success Criteria** (what must be TRUE):
  1. React Hook Form + Zod installed and configured for complex validation (E.164 phone, char limits, special char escaping)
  2. FormFieldSet component integrates with RHF Controller for consistent label, validation, and error display
  3. Zod schemas defined for each QR type with type-specific validation rules
  4. Component registry maps QR types to form components using data-driven lookup
  5. Type-specific formatters live in lib/formatters/ with co-located Zod schemas
  6. Existing QR types (URL, text, email) migrated to use React Hook Form pattern
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — Install RHF+Zod, create Zod schemas and formatters for url/text/email
- [x] 05-02-PLAN.md — Create FormFieldSet, type-specific forms, registry, migrate page.tsx

#### Phase 6: Simple QR Types
**Goal**: User can generate WhatsApp and WiFi QR codes
**Depends on**: Phase 5
**Requirements**: WHATSAPP-01, WHATSAPP-02, WHATSAPP-03, WHATSAPP-04, WIFI-01, WIFI-02, WIFI-03, WIFI-04, WIFI-05, WIFI-06
**Success Criteria** (what must be TRUE):
  1. User can create WhatsApp QR with phone number and optional pre-filled message
  2. WhatsApp phone numbers validate to E.164 format with country code selector
  3. System generates correct wa.me/{number}?text={message} URL
  4. User can create WiFi QR with SSID, password, encryption type, and hidden SSID toggle
  5. WiFi passwords with special characters (semicolons, backslashes) work correctly after scanning
  6. System generates correct WIFI:T:{type};S:{ssid};P:{pass};H:{hidden};; format with proper escaping
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

#### Phase 7: Complex QR Types
**Goal**: User can generate vCard and Telegram QR codes
**Depends on**: Phase 6
**Requirements**: VCARD-01, VCARD-02, VCARD-03, VCARD-04, VCARD-05, VCARD-06, VCARD-07, VCARD-08, VCARD-09, VCARD-10, TELEGRAM-01, TELEGRAM-02, TELEGRAM-03, TELEGRAM-04
**Success Criteria** (what must be TRUE):
  1. User can create vCard QR with full name, phone, email, website, company, title, and department
  2. vCard QR codes scan correctly on iOS native camera with proper character encoding
  3. vCard fields with special characters (semicolons, commas, newlines) encode correctly
  4. Character counter warns user when vCard data approaches 1400+ character limit
  5. User can create Telegram QR in username, phone, or bot mode
  6. Telegram username mode auto-strips @ symbol and validates 5-32 characters
  7. System generates correct t.me/{username} or t.me/{phone} URL format
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD
- [ ] 07-03: TBD

#### Phase 8: Event QR Codes
**Goal**: User can generate calendar event QR codes
**Depends on**: Phase 7
**Requirements**: EVENT-01, EVENT-02, EVENT-03, EVENT-04, EVENT-05, EVENT-06, EVENT-07
**Success Criteria** (what must be TRUE):
  1. User can create event QR with title, location, description, start/end date-time, and timezone
  2. Event QR codes generate valid iCalendar format with required fields (UID, DTSTAMP, TZID)
  3. Events import with correct times across different device timezones
  4. Timezone selector provides standard timezone list (America/New_York format)
  5. System prevents end time from being before start time
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

#### Phase 9: Visual Enhancements
**Goal**: Enhanced style system and standard logo library
**Depends on**: Phase 5 (can run parallel with Phases 6-8)
**Requirements**: STYLE-08, STYLE-09, STYLE-10, STYLE-11, LOGO-01, LOGO-02, LOGO-03, LOGO-04, LOGO-05, LOGO-06
**Success Criteria** (what must be TRUE):
  1. User can select from 15-20 total dot/module style options (5-10 new + existing)
  2. User can select from 15-20 total corner style options (5-10 new + existing)
  3. Style picker displays visual thumbnail preview for each style option
  4. New styles can be added via config file without code changes
  5. User can select from 10-15 standard logos (brands and generic icons)
  6. Logo library includes WhatsApp, Telegram, PayPal, Stripe, and generic icons (user, calendar, WiFi, email, phone, link)
  7. Logo picker coexists with existing custom upload option
  8. Standard logos enforce 33% of QR dimension size limit
**Plans**: TBD

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD

## Progress

**Execution Order:**
v1.1 phases execute sequentially: 5 -> 6 -> 7 -> 8 -> 9 (Phase 9 can run parallel after Phase 5)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Core Generation | v1.0 | 3/3 | Complete | 2026-01-27 |
| 2. Advanced Styling | v1.0 | 2/2 | Complete | 2026-01-27 |
| 3. Configuration Sharing | v1.0 | 1/1 | Complete | 2026-01-27 |
| 4. UI Polish | v1.0 | 1/1 | Complete | 2026-01-27 |
| 5. Form System Foundation | v1.1 | 2/2 | Complete | 2026-01-27 |
| 6. Simple QR Types | v1.1 | 0/TBD | Not started | - |
| 7. Complex QR Types | v1.1 | 0/TBD | Not started | - |
| 8. Event QR Codes | v1.1 | 0/TBD | Not started | - |
| 9. Visual Enhancements | v1.1 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-27*
*Last updated: 2026-01-27 (Phase 5 complete: Form System Foundation)*
