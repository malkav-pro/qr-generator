# Requirements: QR Code Generator

**Defined:** 2026-01-27 (v1.1)
**Core Value:** Generate QR codes you actually own — data encoded directly, no redirect service dependency

## v1.1 Requirements

Requirements for v1.1 release. Each maps to roadmap phases.

**Stack additions for v1.1:**
- `react-hook-form` - Complex form validation (E.164 phone, char limits, cross-field validation)
- `zod` - Type-safe schema validation with transform/escape capabilities
- `vcards-js` - vCard 3.0 generation library
- `ics` - iCalendar format generation
- `@icons-pack/react-simple-icons` - Standard logo library (3300+ brand icons)

### vCard QR Codes

- [ ] **VCARD-01**: User can enter full name for vCard
- [ ] **VCARD-02**: User can enter phone number for vCard
- [ ] **VCARD-03**: User can enter email address for vCard
- [ ] **VCARD-04**: User can enter website URL for vCard
- [ ] **VCARD-05**: User can enter company name for vCard
- [ ] **VCARD-06**: User can enter job title for vCard
- [ ] **VCARD-07**: User can enter department for vCard
- [ ] **VCARD-08**: System generates vCard 3.0 format (iOS/Android compatible)
- [ ] **VCARD-09**: System automatically escapes special characters (;,:\n) in vCard fields
- [ ] **VCARD-10**: Character counter displays remaining capacity with warning at 1400+ chars

### WhatsApp QR Codes

- [ ] **WHATSAPP-01**: User can enter phone number with country code selector
- [ ] **WHATSAPP-02**: User can enter optional pre-filled message text
- [ ] **WHATSAPP-03**: System validates phone to E.164 format (+ prefix, no spaces/dashes)
- [ ] **WHATSAPP-04**: System generates wa.me/{number}?text={message} URL

### Telegram QR Codes

- [ ] **TELEGRAM-01**: User can select input mode (username, phone, or bot)
- [ ] **TELEGRAM-02**: Username mode validates 5-32 characters and auto-strips @ symbol
- [ ] **TELEGRAM-03**: Phone mode validates E.164 format with country code selector
- [ ] **TELEGRAM-04**: System generates t.me/{username} or t.me/{phone} URL

### Event/Calendar QR Codes

- [ ] **EVENT-01**: User can enter event title
- [ ] **EVENT-02**: User can enter event location
- [ ] **EVENT-03**: User can enter event description
- [ ] **EVENT-04**: User can select start date and time
- [ ] **EVENT-05**: User can select end date and time
- [ ] **EVENT-06**: User can select timezone from standard list
- [ ] **EVENT-07**: System generates iCalendar format with required fields (UID, DTSTAMP, TZID)

### WiFi QR Codes

- [ ] **WIFI-01**: User can enter network SSID
- [ ] **WIFI-02**: User can enter network password
- [ ] **WIFI-03**: User can select encryption type (WPA/WPA2, WEP, Open)
- [ ] **WIFI-04**: User can toggle hidden SSID option
- [ ] **WIFI-05**: System automatically escapes special characters (;:\,") in SSID/password
- [ ] **WIFI-06**: System generates WIFI:T:{type};S:{ssid};P:{pass};H:{hidden};; format

### Style System Enhancement

- [ ] **STYLE-08**: User can select from 5-10 additional dot/module style options
- [ ] **STYLE-09**: User can select from 5-10 additional corner style options
- [ ] **STYLE-10**: Style picker displays visual preview thumbnail for each option
- [ ] **STYLE-11**: Style system is config-driven (new styles added via config, not code changes)

### Logo Library

- [ ] **LOGO-01**: User can select from 10-15 standard logos in picker
- [ ] **LOGO-02**: Logo library includes brand icons (WhatsApp, Telegram, PayPal, Stripe, etc.)
- [ ] **LOGO-03**: Logo library includes generic icons (user, calendar, WiFi, email, phone, link)
- [ ] **LOGO-04**: Logo picker coexists with existing custom upload option
- [ ] **LOGO-05**: Logo size validation enforces 33% of QR dimension limit (width/height)
- [ ] **LOGO-06**: Standard logos sourced from Lucide and simple-icons libraries

## v1.0 Requirements (Completed 2026-01-27)

### QR Code Types

- [x] **TYPE-01**: User can generate QR code for URL *(Phase 1)*
- [x] **TYPE-02**: User can generate QR code for plain text *(Phase 1)*
- [x] **TYPE-03**: User can generate QR code for email (mailto: with optional subject/body) *(Phase 1)*

### Visual Customization

- [x] **STYLE-01**: User can set foreground color (solid) *(Phase 1)*
- [x] **STYLE-02**: User can set background color *(Phase 1)*
- [x] **STYLE-03**: User can apply gradient to foreground (linear/radial) *(Phase 2)*
- [x] **STYLE-04**: User can select dot/module style (square, rounded, dots, classy, extra-rounded) *(Phase 2)*
- [x] **STYLE-05**: User can select corner square style (square, dot, extra-rounded) *(Phase 2)*
- [x] **STYLE-06**: User can select corner dot style *(Phase 2)*
- [x] **STYLE-07**: User can upload and overlay center logo *(Phase 2)*

### Export

- [x] **EXPORT-01**: User can export QR code as PNG at configurable resolution *(Phase 1)*
- [x] **EXPORT-02**: User can export QR code as SVG *(Phase 2)*

### Preview

- [x] **PREVIEW-01**: User sees real-time preview of QR code as settings change *(Phase 1)*
- [x] **PREVIEW-02**: Preview updates with debounce to prevent lag during typing *(Phase 1)*

### Sharing

- [x] **SHARE-01**: App encodes current configuration in URL hash *(Phase 3)*
- [x] **SHARE-02**: Visiting URL with hash restores all settings *(Phase 3)*
- [x] **SHARE-03**: User can copy shareable URL *(Phase 3)*

### Technical Quality

- [x] **TECH-01**: QR codes use Error Correction Level H by default (30% recovery) *(Phase 1)*
- [x] **TECH-02**: QR codes include proper quiet zone (4-module margin) *(Phase 1)*
- [x] **TECH-03**: App enforces minimum contrast ratio for scannability *(Phase 1)*
- [x] **TECH-04**: Logo overlay respects error correction capacity limits *(Phase 1)*
- [x] **TECH-05**: App works entirely client-side (no server requests for generation) *(Phase 1)*

### UI/UX

- [x] **UI-01**: Responsive design works on mobile and desktop *(Phase 1)*
- [x] **UI-02**: Modern, polished interface designed via ui-designer skill (not generic Bootstrap look) *(Phase 4)*
- [x] **UI-03**: Intuitive color picker with gradient support *(Phase 2)*
- [x] **UI-04**: Clear visual hierarchy — preview prominent, controls organized logically *(Phase 1)*
- [x] **UI-05**: Style picker controls with visual previews (like qr.io screenshot) *(Phase 2)*

## v2.0+ Requirements (Future)

Deferred to future releases. Tracked but not in current roadmap.

### Extended vCard Fields

- **VCARD-EXT-01**: Multiple phone numbers (home, work, mobile)
- **VCARD-EXT-02**: Multiple email addresses
- **VCARD-EXT-03**: Physical address fields (street, city, state, postal code, country)
- **VCARD-EXT-04**: Birthday field
- **VCARD-EXT-05**: Social media profile links
- **VCARD-EXT-06**: Profile photo

### Extended Event Features

- **EVENT-EXT-01**: Recurring events (daily, weekly, monthly)
- **EVENT-EXT-02**: Event reminders/alarms
- **EVENT-EXT-03**: Attendee list and RSVP tracking
- **EVENT-EXT-04**: Organizer information

### Advanced Features

- **ADV-01**: Batch/bulk QR code generation
- **ADV-02**: Print-ready templates (business cards, stickers)
- **ADV-03**: Real-time scannability confidence indicator
- **ADV-04**: Brand preset saving (localStorage)
- **ADV-05**: Template system for common use cases
- **ADV-06**: Download .vcf file option (in addition to QR)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Dynamic QR codes | Requires redirect service = dependency = defeats core value |
| Analytics/tracking | Requires backend, contradicts privacy-first positioning |
| User accounts | Adds friction, requires backend |
| Database | All state lives in URL hash — stateless by design |
| QR shortening/redirect | This is exactly what screwed the user — never build this |
| Server-side generation | Unnecessary, adds latency, requires backend |
| AI-generated QR art | Scannability issues, gimmick over function |
| Custom style designer | High complexity, limited value vs pre-built options |
| vCard 4.0 format | Poor QR reader support as of 2026 — use vCard 3.0 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

### v1.1 Requirements Mapping

| Requirement | Phase | Status |
|-------------|-------|--------|
| VCARD-01 | Phase 7 | Complete |
| VCARD-02 | Phase 7 | Complete |
| VCARD-03 | Phase 7 | Complete |
| VCARD-04 | Phase 7 | Complete |
| VCARD-05 | Phase 7 | Complete |
| VCARD-06 | Phase 7 | Complete |
| VCARD-07 | Phase 7 | Complete |
| VCARD-08 | Phase 7 | Complete |
| VCARD-09 | Phase 7 | Complete |
| VCARD-10 | Phase 7 | Complete |
| WHATSAPP-01 | Phase 6 | Complete |
| WHATSAPP-02 | Phase 6 | Complete |
| WHATSAPP-03 | Phase 6 | Complete |
| WHATSAPP-04 | Phase 6 | Complete |
| TELEGRAM-01 | Phase 7 | Complete |
| TELEGRAM-02 | Phase 7 | Complete |
| TELEGRAM-03 | Phase 7 | Complete |
| TELEGRAM-04 | Phase 7 | Complete |
| EVENT-01 | Phase 8 | Complete |
| EVENT-02 | Phase 8 | Complete |
| EVENT-03 | Phase 8 | Complete |
| EVENT-04 | Phase 8 | Complete |
| EVENT-05 | Phase 8 | Complete |
| EVENT-06 | Phase 8 | Complete |
| EVENT-07 | Phase 8 | Complete |
| WIFI-01 | Phase 6 | Complete |
| WIFI-02 | Phase 6 | Complete |
| WIFI-03 | Phase 6 | Complete |
| WIFI-04 | Phase 6 | Complete |
| WIFI-05 | Phase 6 | Complete |
| WIFI-06 | Phase 6 | Complete |
| STYLE-08 | Phase 9 | Pending |
| STYLE-09 | Phase 9 | Pending |
| STYLE-10 | Phase 9 | Pending |
| STYLE-11 | Phase 9 | Pending |
| LOGO-01 | Phase 9 | Pending |
| LOGO-02 | Phase 9 | Pending |
| LOGO-03 | Phase 9 | Pending |
| LOGO-04 | Phase 9 | Pending |
| LOGO-05 | Phase 9 | Pending |
| LOGO-06 | Phase 9 | Pending |

**Coverage:**
- v1.1 requirements: 35 total
- Mapped to phases: 35/35 (100%)
- Unmapped: 0

**Phase Distribution:**
- Phase 5 (Foundation): Infrastructure (enables all other phases)
- Phase 6 (Simple QR Types): 8 requirements (WHATSAPP + WIFI)
- Phase 7 (Complex QR Types): 14 requirements (VCARD + TELEGRAM)
- Phase 8 (Event QR Codes): 7 requirements (EVENT)
- Phase 9 (Visual Enhancements): 10 requirements (STYLE + LOGO)

---
*Requirements defined: 2026-01-27*
*Last updated: 2026-01-27 (v1.1 traceability complete)*
