# Research Summary: QR Code Generator v1.1

**Project:** QR Code Generator v1.1 Milestone
**Domain:** Client-side QR code generation with new data types and style system
**Researched:** 2026-01-27
**Confidence:** HIGH

## Executive Summary

v1.1 is an **incremental addition** to a proven v1.0 foundation shipped on 2026-01-27. The existing architecture (Next.js 15 + React 19 + qr-code-styling) is well-suited for the new requirements with minimal technical risk. The milestone adds 5 new QR types (vCard, WhatsApp, Telegram, Events, WiFi), refactors the style system to be config-driven, and introduces a standard logo library.

**Technical approach:** All new QR types leverage the existing qr-code-styling library by passing formatted strings - no new QR generation dependencies needed. Three lightweight packages (vcards-js, ics, @icons-pack/react-simple-icons) provide data formatting and logo assets. The main complexity is **validation and encoding**, not generation. Each new type requires format-specific string encoding (RFC specifications) with proper escaping and validation.

**Key risks and mitigation:** The primary risk is format compliance - malformed vCard/iCal/WiFi strings break scannability despite valid QR generation. Research identified 11 critical pitfalls (special character escaping, timezone handling, phone number validation, logo coverage limits) that must be addressed during implementation, not patched later. All pitfalls have documented prevention patterns with HIGH confidence from official RFCs and platform compatibility testing. The existing codebase already demonstrates correct patterns (EmailInput with validation, debounced generation, type-specific formatters).

## Key Findings

### Recommended Stack

v1.1 requires **minimal stack additions** to the existing Next.js 15 + React 19 + TypeScript foundation. The existing qr-code-styling library handles all QR generation - new packages only provide data formatting.

**Core additions (3 packages):**
- **vcards-js (2.10.0)** — vCard 3.0 generation — Battle-tested library (23K+ weekly downloads) with vCard 3.0 for broader QR reader support than 4.0. Zero dependencies, browser-compatible.
- **ics (3.8.1)** — iCalendar event generation — RFC 5545 compliant, 3.8K+ dependents, native TypeScript support. Simple API for VEVENT creation.
- **@icons-pack/react-simple-icons (13.8.0)** — Brand logo library — 3300+ logos as React components, tree-shakeable. Provides WhatsApp, Telegram, GitHub, LinkedIn, etc.

**Key stack decision:** vCard 3.0 over 4.0 despite 4.0's technical advantages (UTF-8, better internationalization). Reason: vCard 4.0 has poor QR reader compatibility. Multiple sources confirm 3.0 has broader support in 2026, especially with iOS native scanner.

**Bundle impact:** ~50KB gzipped total for all v1.1 additions (vcards-js: ~5KB, ics: ~15KB, icons: ~30KB tree-shakeable).

**No refactoring needed:** Existing stack (Next.js, qr-code-styling, TypeScript, Tailwind, shadcn/ui) handles v1.1 requirements without changes.

### Expected Features

v1.1 scope is clearly defined - **no feature creep risk**.

**Must have (v1.1 requirements):**
- vCard QR codes — Digital business cards (7 fields: name, email, phone, company, title, website)
- WhatsApp QR codes — Pre-filled messaging with E.164 phone validation
- Telegram QR codes — Username or phone-based chat links
- Event QR codes — iCalendar VEVENT with timezone handling
- WiFi QR codes — Network auto-join with WPA/WPA2/WEP support
- Style system refactor — Config-driven with 5-10 new dot/corner styles
- Standard logo library — 10-15 pre-bundled brand logos (social, tech categories)

**Should have (quality requirements):**
- Format validation per type — Prevent encoding failures before QR generation
- Special character escaping — vCard/WiFi require backslash escaping
- Timezone specification — Events must include TZID or UTC format
- E.164 phone conversion — WhatsApp/Telegram require international format
- Logo coverage limits — Max 20% QR area (30% unreliable despite error correction)
- Contrast validation — Logo-to-QR background ratio ≥ 4.5:1

**Defer (explicitly out of scope):**
- Batch/bulk generation — High complexity, not in v1.1
- Real-time scannability test — High complexity, future feature
- Additional QR types beyond the 5 — Scope creep risk
- Dynamic QR codes — Anti-feature per v1.0 positioning

### Architecture Approach

v1.1 extends existing patterns without breaking changes. The current architecture already demonstrates best practices: controlled component pattern with centralized state, type-specific formatters (mailto-formatter.ts), debounced generation hook, and config-driven constants.

**Major components for v1.1:**

1. **Form Component Registry** — Maps QR types to form components (URLInput, VCardInput, etc.) using registry pattern. Replaces conditional rendering with data-driven lookup. Each type gets isolated file (50-180 lines), preventing monolithic DataInput component.

2. **Type-Specific Formatters** — Pure functions in `lib/formatters/` for protocol encoding (vCard RFC 6350, iCal RFC 5545, WiFi ZXing format). Co-located validators for each type. Existing mailto-formatter.ts demonstrates correct pattern.

3. **Config-Driven Style System** — Unified registry with preview metadata replaces specialized picker components. Adding new style = 5-line config object, 0 component code. Generic StylePicker renders all types from registry data.

4. **Dual-Mode Logo Component** — Extends existing LogoUploader with tab interface (Upload | Library). AssetPicker loads manifest.json for gallery. Both modes produce data URL, parent sees no difference.

5. **FormFieldSet Component** — Reusable field wrapper (label, validation, required indicator) extracted from EmailInput pattern. Prevents boilerplate across 5 new complex forms.

**Integration points:**
- TypeSelector: Add 5 new type buttons (additive, no breaking changes)
- DataInput: Refactor to use registry (behavior unchanged externally)
- QRConfig type: Extend QRType union (additive)
- LogoUploader: Add library picker tab (upload mode unchanged)

**Data flow:** Complex forms (vCard with 7 fields) maintain structured data locally (VCardData object), only propagate formatted string to parent when valid. Prevents QR regeneration on every keystroke. Combined with useQRCode 300ms debounce, QR only regenerates after user pauses typing.

### Critical Pitfalls

Research identified 11 pitfalls specific to v1.1 data types. Top 5 with highest impact:

1. **vCard special character encoding failure** — Non-ASCII characters (é, ü, ö) display as garbage on iOS when vCard 2.1 used or CHARSET=UTF-8 omitted. Use vCard 3.0+ with explicit UTF-8 encoding. Escape backslash, semicolon, comma, newlines. Test on iOS native camera.

2. **iCal timezone handling failures** — Events import with wrong times (off by hours) when timezone specification missing. Use UTC format (DTSTART:20260315T140000Z) or TZID with VTIMEZONE component. Never use "floating" time without timezone. Test across timezones.

3. **WiFi special character escaping** — Passwords with semicolons/backslashes fail to connect despite QR scanning correctly. Format uses semicolon as delimiter: `WIFI:S:SSID;T:WPA;P:Password;;`. Escape all special chars (`;` → `\;`, `\` → `\\`, etc.) before assembling string.

4. **WhatsApp/Telegram phone validation failures** — Links fail when phone numbers include spaces/dashes or wrong format. Both require E.164 international format: `+[country code][number]` with NO spaces. WhatsApp URL omits + (`https://wa.me/1234567890`), Telegram includes it (`https://t.me/+1234567890`). Strip all non-digits, validate country code, remove leading zero.

5. **Logo overlay exceeds 20% coverage** — QR codes with large logos fail to scan despite error correction Level H. While Level H allows 30% restoration, covering 30%+ blocks too many data modules. Conservative safe limit is 20% area. Calculate: `(logo_width * logo_height) / (qr_width * qr_height) * 100 ≤ 20%`. Add validation before QR generation.

**Common thread:** All pitfalls stem from **format specification compliance**, not QR generation itself. Prevention requires validation functions that enforce RFC specs (vCard 3.0, iCal RFC 5545) and platform requirements (iOS UTF-8, E.164 phone). These must be built into initial implementation, not patched later.

## Implications for Roadmap

Based on combined research, v1.1 should be structured in **3 sequential phases** with foundation-first approach. The existing architecture patterns (component registry, type-specific formatters) must be established before implementing new types.

### Phase 1: Form System Foundation (1.5 days)

**Rationale:** Establish patterns before building all 5 types. Validates registry architecture with known-good forms (URL, text, email already working). Prevents rework - if pattern doesn't scale, discover it early.

**Delivers:**
- FormFieldSet reusable component extracted from EmailInput
- Formatter directory structure with mailto-formatter moved
- Form component registry mapping QRType → Component + validator + formatter
- Existing forms (URLInput, TextInput, EmailInput) extracted to separate files
- DataInput refactored to use registry lookup

**Addresses:**
- Architecture pattern from ARCHITECTURE.md (component registry, config-driven)
- Anti-pattern avoidance from PITFALLS.md (monolithic components, inline formatters)

**Validation:** All existing functionality works through new pattern. Zero user-facing changes. URL state sync verified unchanged.

**Research flag:** Standard patterns, skip phase research (patterns verified in existing code).

---

### Phase 2: New Data Types - MVP (4 days)

**Rationale:** Build highest-value types first in complexity order. WhatsApp validates end-to-end flow (simplest). WiFi tests escaping (medium). vCard proves pattern scales (most complex). If 3 types work, remaining 2 (Telegram, Events) follow same pattern.

**Delivers (in order):**

**2A. WhatsApp (6 hours)** — Simplest new type
- WhatsAppData interface (phone, message)
- whatsapp-formatter.ts with E.164 validation
- WhatsAppInput component (2 fields with FormFieldSet)
- Phone number validation: international format, strip spaces/dashes
- Add to registry and TypeSelector

**2B. WiFi (10 hours)** — Tests escaping
- WiFiData interface (ssid, password, security, hidden)
- wifi-formatter.ts with special character escaping
- WiFiInput component (4 fields, conditional password)
- Escape `;:,\` in SSID/password before format assembly
- Security type selector (WPA/WPA2/WEP/nopass)

**2C. vCard (16 hours)** — Most complex, highest value
- VCardData interface (7 fields: firstName, lastName, email, phone, organization, title, website)
- vcard-formatter.ts with RFC 6350 compliance
- VCardInput component (7 fields with validation)
- Field escaping for semicolons, commas, newlines
- vCard 3.0 format with UTF-8 encoding specification
- Test on iOS native camera (critical validation)

**Addresses:**
- FEATURES.md requirements (vCard, WhatsApp, WiFi)
- PITFALLS.md #1, #7, #9 (special character escaping, phone validation)
- STACK.md additions (vcards-js, formatters)

**Avoids:**
- Pitfall #2 (inline protocol formatting) via separate formatter files
- Pitfall #1 (monolithic DataInput) via component extraction

**Research flag:** Need phase research for vCard RFC 6350 edge cases and WiFi ZXing format details. Standard patterns for WhatsApp/Telegram (URL schemes well-documented).

---

### Phase 3: Style Refactor + Logo Library (4 days, can run parallel)

**Rationale:** Style system and logo library are independent of data types. Can develop in parallel with Phase 2 after Phase 1 completes. Both extend existing components without breaking changes.

**Delivers:**

**3A. Style System Refactor (2 days)**
- style-registry.ts with unified StyleOption interface
- Migrate existing DOT_STYLES, CORNER_SQUARE_STYLES to registry format
- Add preview SVG paths for existing styles
- Refactor generic StylePicker to use registry data
- Add 5-10 new styles as pure config (no code)

**3B. Logo Library (2 days)**
- Curate 10-15 SVG logos in public/logos/ (social, tech categories)
- Create manifest.json with metadata (path, name, category, size)
- Build AssetPicker component (grid gallery with category filter)
- Extend LogoUploader with tab interface (Upload | Library)
- Logo selection → data URL conversion

**Addresses:**
- FEATURES.md requirements (style system refactor, logo library)
- STACK.md addition (@icons-pack/react-simple-icons)
- ARCHITECTURE.md pattern (config-driven, dual-mode component)
- PITFALLS.md #10, #11 (logo coverage limits, contrast validation)

**Avoids:**
- Pitfall #3 (hardcoded style components) via config-driven registry

**Research flag:** Standard patterns for asset management and component libraries. Skip phase research (well-documented in ARCHITECTURE.md).

---

### Phase 4: Remaining Types (Deferred to post-MVP)

**Rationale:** Telegram and Events follow same patterns proven in Phase 2. With WhatsApp, WiFi, vCard working, pattern is validated. Can be added quickly after Phase 2 validation.

**Delivers:**
- Telegram QR codes (similar to WhatsApp, 1-2 fields)
- Event QR codes (5 fields with timezone handling)

**Addresses:**
- FEATURES.md requirements (Telegram, Events)
- PITFALLS.md #4, #5, #6 (iCal timezone, required fields, DTEND behavior)

**Recommended timing:** After Phase 2 user validation. If vCard/WiFi/WhatsApp see adoption, add Telegram/Events using proven pattern.

---

### Phase Ordering Rationale

**Why this sequence:**

1. **Foundation first** — Component registry pattern must be proven before building 5 new types. Discovering pattern doesn't scale after building 3 types = massive rework.

2. **Complexity gradient** — WhatsApp (simple) → WiFi (medium) → vCard (complex) allows early problem detection. If vCard works, Telegram/Events are straightforward.

3. **Independent work streams** — Style refactor and logo library don't depend on new QR types. Can parallelize after foundation.

4. **Early validation** — 3 types (WhatsApp, WiFi, vCard) prove value. Defer remaining 2 until user feedback validates approach.

**Dependency structure:**
```
Phase 1 (Foundation)
  ├─→ Phase 2A (WhatsApp)
  │     ├─→ Phase 2B (WiFi)
  │     │     └─→ Phase 2C (vCard)
  │     │           └─→ Phase 4 (Telegram, Events) [deferred]
  │
  ├─→ Phase 3A (Style System) [parallel with Phase 2]
  └─→ Phase 3B (Logo Library) [parallel with Phase 2]
```

**Avoids pitfalls by:**
- Building validation into formatters from start (prevents Pitfalls #1, #2, #7)
- Testing cross-platform early (iOS vCard validation catches Pitfall #1)
- Enforcing format specs in code (RFC compliance prevents Pitfalls #4, #5, #6)
- Logo validation before generation (prevents Pitfalls #10, #11)

### Research Flags

**Phases needing deeper research:**

- **Phase 2C (vCard)** — RFC 6350 edge cases, ADR field structured format (7 semicolon-separated fields), vCard 3.0 vs 4.0 compatibility matrix. ARCHITECTURE.md provides patterns, but format nuances require spec review during implementation.

- **Phase 4 (Events)** — RFC 5545 VTIMEZONE component generation, RRULE recurrence patterns (if added), all-day event DATE vs DATE-TIME format. Multiple timezone handling scenarios need validation.

**Phases with standard patterns (skip research):**

- **Phase 1 (Foundation)** — React component registry pattern well-documented. Existing codebase demonstrates correct approach (EmailInput, mailto-formatter).

- **Phase 2A (WhatsApp)** — URL scheme well-documented. E.164 validation libraries available. Standard pattern.

- **Phase 2B (WiFi)** — ZXing WiFi format documented. Escaping rules clear. Standard implementation.

- **Phase 3A (Style System)** — Config-driven UI patterns verified. SVG path rendering straightforward.

- **Phase 3B (Logo Library)** — Asset manifest patterns common. Gallery components well-documented (PrimeReact Galleria reference).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified with npm/GitHub. vcards-js, ics, @icons-pack/react-simple-icons actively maintained. vCard 3.0 vs 4.0 decision backed by multiple sources. No version conflicts detected. |
| Features | HIGH | v1.1 scope clearly defined. All features have verified library support. No feature gaps discovered. Table stakes vs differentiators well-researched from competitive analysis. |
| Architecture | HIGH | Patterns verified in existing codebase. Component registry, type-specific formatters, config-driven constants already proven. FormFieldSet extraction follows existing EmailInput pattern. No architectural unknowns. |
| Pitfalls | HIGH | All 11 pitfalls backed by official RFCs (6350, 5545), platform documentation (iOS/Android), and documented interoperability issues. Prevention patterns tested in production systems. Special character escaping rules verified from specs. |

**Overall confidence:** HIGH

### Gaps to Address

**Minor gaps requiring validation during implementation:**

- **vCard QR capacity** — With 7 fields filled, does vCard string exceed recommended QR capacity? Research suggests 500-character safe limit. Need to validate during Phase 2C. Mitigation: Add length validator, warn user if data too long.

- **WiFi protocol browser support** — ZXing format works on Android 10+, iOS 11+, Windows 11. Edge cases for older devices unclear. Mitigation: Add help text about device requirements, test on minimum supported OS versions.

- **Logo library categories** — Start with 2-3 categories (social, tech, business) or flat list? Research doesn't provide clear guidance. Mitigation: Start with flat "all" view, add categories if >20 logos.

- **Event timezone validation** — VTIMEZONE component generation for custom timezones adds complexity. Research shows TZID with standard zones (America/New_York) works without VTIMEZONE. Mitigation: Phase 4 can use standard TZID database, defer custom VTIMEZONE.

- **Style preview performance** — Rendering 15+ SVG previews simultaneously - potential performance issue on low-end devices. Research doesn't quantify impact. Mitigation: Test on mobile, add lazy loading if needed.

**All gaps have clear mitigation paths. None block v1.1 implementation.**

## Sources

### Primary (HIGH confidence)

**Official Specifications:**
- RFC 6350 (vCard Format Specification) — vCard 3.0/4.0 structure, field requirements, escaping rules
- RFC 5545 (iCalendar Core Object) — VEVENT component, DTSTART/DTEND format, timezone handling
- RFC 2426 (vCard 3.0 specification) — Older spec for backwards compatibility validation

**Package Documentation:**
- vcards-js npm package (23K weekly downloads) — vCard 3.0 generation library verification
- ics npm package (3.8K dependents) — iCalendar event generation API
- @icons-pack/react-simple-icons npm — Simple Icons 16.1.0 as React components

**Platform Documentation:**
- iOS Developer Forums — vCard 4.0 QR compatibility issues with native camera
- Android Developers — WiFi QR format support since Android 10
- WhatsApp FAQ — E.164 international phone number format requirements
- Twilio E.164 Documentation — Phone number format specification

### Secondary (MEDIUM confidence)

**Community Research:**
- vCard version comparison (Wikipedia, ez-vcard wiki) — Version differences, QR reader compatibility
- WiFi QR format guides (Pocketables, feeding.cloud.geek.nz) — ZXing format escaping rules
- QR Code error correction research (Scanova, DENSO WAVE) — Logo coverage limits, Level H capacity
- React design patterns (refine.dev, LogRocket) — Component registry patterns, config-driven UI
- Form best practices (orizens.com, daily.dev) — Complex form architecture, validation patterns

**Ecosystem Sources:**
- GitHub issue trackers (QRCoder #554, ical-generator #154) — Real-world problems with diacritics, timezones
- Adobe Community Forums — vCard umlaut encoding issues with InDesign QR generator
- StackOverflow discussions — WiFi password special characters, vCard ADR field structure

### Tertiary (LOW confidence, validated via multiple sources)

**Technology Comparison Articles:**
- "Top 11 React Icon Libraries for 2026" (lineicons.com) — @icons-pack/react-simple-icons positioning
- "Best QR Code Generators 2026" (multiple sources) — Static vs dynamic market split, feature landscape
- "React & TypeScript: 10 patterns" (LogRocket) — TypeScript extension patterns

**All tertiary sources cross-referenced with primary specifications or multiple secondary sources. No single-source findings included in critical recommendations.**

---

## Ready for Roadmap

**Status:** Research complete. SUMMARY.md synthesized from 4 parallel research outputs.

**Next steps:**
1. Orchestrator proceeds to requirements definition using this summary
2. Roadmap creation uses suggested phase structure (4 phases with 3 in v1.1 scope)
3. Phase 2C (vCard) and Phase 4 (Events) flagged for spec review during planning

**Key recommendation for roadmapper:** Foundation-first approach is critical. Phase 1 must complete before Phase 2 to validate architecture patterns. Phase 3 can run parallel with Phase 2 to reduce timeline.

**Estimated timeline:**
- Phase 1: 1.5 days
- Phase 2: 4 days (sequential: WhatsApp → WiFi → vCard)
- Phase 3: 4 days (parallel with Phase 2 after Phase 1)
- **Total v1.1 (Phases 1-3): 5.5 days** (with parallelization)
- Phase 4: 2 days (deferred post-MVP validation)

---

*Research completed: 2026-01-27*
*Ready for roadmap: yes*
