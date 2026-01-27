# Feature Research: v1.1 New QR Types

**Milestone:** v1.1 - vCard, WhatsApp, Telegram, Events, WiFi QR Codes
**Researched:** 2026-01-27
**Confidence:** MEDIUM

**Note:** This document supplements the main FEATURES.md with milestone-specific research for v1.1's five new QR code types.

---

## Executive Summary

v1.1 adds five high-value QR types that cover the majority of non-URL use cases. Research shows these types have well-established format standards and clear user expectations:

- **vCard:** Digital business card standard (vCard 3.0/4.0 format)
- **WhatsApp:** Click-to-chat format (wa.me/{number}?text=message)
- **Telegram:** Deep link format (t.me/username or tg:// protocol)
- **Events:** iCalendar/vEvent standard (.ics format)
- **WiFi:** MECARD-based format (WIFI:T:WPA;S:ssid;P:password;;)

**Critical findings:**
1. **Validation is crucial** - All five types are error-prone without proper format validation
2. **User expectations are high** - "Scan and go" should work 100% of the time
3. **Character encoding matters** - UTF-8 support required for vCard (international names)
4. **Special characters require escaping** - WiFi passwords with ; : , \ " break without proper handling
5. **Timezone handling is critical** - Calendar events without timezone display wrong times

---

## Table Stakes (Users Expect These)

Features users assume exist. Missing these = broken QR type implementation.

### vCard QR Codes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Name fields (first, last, full) | Core contact info, absolutely essential | LOW | Standard vCard field (FN, N) |
| Phone number(s) | Primary contact method | LOW | Support multiple (mobile, work, home) |
| Email address(es) | Essential business contact | LOW | Support multiple emails |
| Organization/Company | Business context | LOW | vCard ORG field |
| Job title/Role | Professional context | LOW | vCard TITLE field |
| UTF-8 encoding support | International names/characters | MEDIUM | Required for non-English characters to display correctly |
| Character limit validation | Prevent QR code corruption | LOW | Max 1476 characters for vCard in QR |
| Website/URL | Expected on business cards | LOW | vCard URL field |
| Physical address | Location-based contact | MEDIUM | Support structured address fields |

**Format:** Standard vCard 3.0/4.0 with BEGIN:VCARD / END:VCARD wrapper

**User expectation:** Scan → Opens contacts app → Tap "Add Contact" → Saved

**Critical pitfalls:**
- Exceeding 1476 character limit causes QR corruption/trimming
- Missing UTF-8 encoding causes international characters to display as ???
- Special characters without proper encoding break on some Android devices

### WhatsApp QR Codes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| International phone format | WhatsApp requires country code | MEDIUM | Format: wa.me/{countrycode}{number} - no +, spaces, dashes |
| Phone number validation | Prevent broken links | MEDIUM | Must validate E.164 format without special chars |
| Pre-filled message (optional) | Common use case for marketing | LOW | URL param: ?text=message (+ for spaces) |
| Country code helper/selector | Simplify international format | MEDIUM | Users struggle with format requirements |

**Format:** https://wa.me/12025551234?text=Hello+World

**User expectation:** Scan → Opens WhatsApp → Chat with pre-filled message → Send

**Critical pitfalls:**
- Including + symbol or spaces breaks the link (must be digits only)
- Forgetting country code causes "Number not found" errors
- Special characters in message need URL encoding

### Telegram QR Codes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Username support | Primary Telegram identifier | LOW | Format: t.me/username |
| Phone number support | Alternative contact method | MEDIUM | International format required |
| Bot link support | Common business use case | LOW | Support ?start= parameter for bots |
| Deep link format (t.me) | Standard Telegram format | LOW | Browser-friendly, universal |

**Format:** https://t.me/username (or) https://t.me/+12025551234

**User expectation:** Scan → Opens Telegram → Start chat/join channel

**Critical pitfalls:**
- Including @ symbol in username (should be username, not @username)
- Using tg:// protocol (doesn't work in browsers, t.me is universal)
- Username must be 5-32 characters (alphanumeric + underscore only)

### Event/Calendar QR Codes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Event title/summary | Identifies the event | LOW | iCal SUMMARY field |
| Start date/time | When event begins | MEDIUM | iCal DTSTART (format: YYYYMMDDTHHMMSSZ) |
| End date/time | When event ends | MEDIUM | iCal DTEND |
| Location | Where event happens | LOW | iCal LOCATION field |
| Timezone specification | Critical for virtual/global events | HIGH | Prevent wrong time display across zones |
| Description (optional) | Event details | LOW | iCal DESCRIPTION field |
| iCalendar format (.ics) | Universal calendar compatibility | MEDIUM | Works with Google, Apple, Outlook |

**Format:**
```
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Event Title
DTSTART:20260127T140000Z
DTEND:20260127T150000Z
LOCATION:Office
DESCRIPTION:Event details
END:VEVENT
END:VCALENDAR
```

**User expectation:** Scan → Opens calendar app → Tap "Add Event" → Event saved with correct time

**Critical pitfalls:**
- Missing timezone causes event to display at wrong time for users in different zones
- Start/end time reversal (end before start) breaks calendar import
- Date format must be YYYYMMDDTHHMMSSZ (the 'Z' indicates UTC)
- Missing VERSION:2.0 breaks compatibility with some calendar apps

### WiFi QR Codes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| SSID (network name) | Identifies network | LOW | Case-sensitive, required |
| Password | Network access | LOW | Case-sensitive, required for secured networks |
| Encryption type selector | WPA/WPA2/WPA3/WEP/none | LOW | Default to WPA2, support WPA3 for modern networks |
| Hidden SSID support | Common for secure networks | LOW | Format param: H:true/false |
| Special character escaping | Passwords with ; : , \ " | MEDIUM | Must escape with backslash per MECARD standard |
| Open network support | No password option | LOW | Set encryption to "none" |

**Format:** WIFI:T:WPA;S:MyNetwork;P:MyPassword123;H:false;;

**User expectation:** Scan → Prompt "Connect to MyNetwork?" → Tap "Connect" → Auto-connected

**Critical pitfalls:**
- Special characters ; : , \ " must be escaped with backslash or QR breaks
- SSID and password are case-sensitive (MyNetwork != mynetwork)
- Hidden SSID must be marked H:true or connection fails
- Password < 8 characters for WPA/WPA2/WPA3 is invalid
- Forgetting double semicolon ;; at end breaks format

---

## Differentiators (Competitive Advantage)

Features that set v1.1 apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Live Preview & Testing** | Users can scan QR with phone before downloading | MEDIUM | Show actual QR, test scannability across devices |
| **Field Validation with Helpful Errors** | Prevent user mistakes with clear guidance | MEDIUM | Real-time validation, explain format requirements |
| **Smart Defaults** | Pre-populate common values (WPA2 for WiFi, UTC for events) | LOW | Reduce friction, guide best practices |
| **Standard Logo Library** | Pre-loaded icons for WhatsApp, Telegram, WiFi, etc. | MEDIUM | 10-15 recognizable icons, branded look |
| **Format Helpers** | Phone number formatter, date picker, timezone selector | MEDIUM | Reduce format errors, improve UX |
| **Multi-field Support** | vCard: multiple phones/emails; Events: recurring | HIGH | Advanced but expected for power users |
| **Copy QR Data** | Show/copy the encoded data string | LOW | Debugging, transparency, power users |
| **Template System** | Save common configs (office WiFi, personal vCard) | MEDIUM | Repeat use cases benefit greatly |
| **Contrast & Scanability Warnings** | Alert on color choices that reduce readability | MEDIUM | Prevent generation of unscannable QR codes |
| **Character Counter** | Show remaining characters for vCard | LOW | Prevent QR corruption from overflow |
| **Download All Types** | Generate vCard as both QR and .vcf file | MEDIUM | Users often want both formats |

**Key differentiators for v1.1:**

1. **Validation UX** - Most generators show cryptic errors or generate broken QR codes. We validate format AND explain how to fix errors in plain language.

2. **Format helpers** - Country code selector for phone numbers, timezone picker for events, auto-escaping for WiFi passwords. Reduce errors before they happen.

3. **Standard logo library** - Pre-loaded WhatsApp, Telegram, WiFi, Calendar icons. Competitors charge for logo features or require upload.

4. **Character counter for vCard** - Show 1234/1476 characters. Prevents the common mistake of creating too-large QR codes that corrupt.

5. **Copy encoded data** - Power users and developers can see/debug the actual encoded string. Transparency builds trust.

---

## Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **vCard with full CV/resume** | "Put everything in one card" | Creates huge QR (unscannable), overwhelming | Limit to business card equivalent; link to LinkedIn/website |
| **Auto-detect phone format** | "Make it easier" | Many valid formats, error-prone, confusing | Explicit country code selector + validation |
| **Custom calendar formats** | "I want Outlook-specific format" | iCal/vEvent is universal standard | Stick to iCal - works everywhere |
| **Social media in standard vCard** | "Add Instagram to contact" | Standard vCard spec doesn't support social | Note in docs: use vCard Plus for social (future v2) |
| **WiFi QR with network speed info** | "Tell users if it's 2.4GHz or 5GHz" | Not part of WIFI: spec, confuses users | Put in description or use standard SSID naming |
| **Event with complex recurrence** | "Weekly meeting every Tuesday" | iCal RRULE is complex, error-prone | v1.1: single events only; defer recurring to v1.2+ |
| **Telegram bot parameters in v1.1** | "Need ?start= parameter" | Low demand, adds complexity | Defer to v1.2 based on user feedback |
| **vCard photo/avatar** | "Add profile picture" | Bloats QR code size significantly | Recommend profile image on website instead |

**Rationale:**

The anti-features above either:
1. Bloat QR code size (vCard photo, full CV) making codes unscannable
2. Add complexity for edge cases (recurring events, bot parameters)
3. Don't follow established format standards (custom calendar formats)
4. Create confusing UX (auto-detect phone format has too many edge cases)

**Keep v1.1 focused on reliable, scannable QR codes that work 100% of the time.**

---

## Feature Dependencies

```
[Event QR Code]
    └──requires──> [Timezone Selector]
                       └──requires──> [Date/Time Picker]

[vCard QR Code]
    └──requires──> [UTF-8 Encoding]
    └──requires──> [Character Counter]
                       └──requires──> [Field Validation]

[WhatsApp QR Code]
    └──requires──> [Phone Number Validator]
                       └──requires──> [Country Code Selector]

[Telegram QR Code]
    └──requires──> [Username Format Validator]
                       └──optional──> [Phone Number Validator] (if phone option used)

[WiFi QR Code]
    └──requires──> [Special Character Escaper]
                       └──requires──> [Password Field Validation]

[Standard Logo Library] ──enhances──> [All QR Types]

[Live Preview] ──enhances──> [All QR Types]

[Character Counter] ──prevents corruption in──> [vCard QR Code]

[Copy Encoded Data] ──helps debug──> [All QR Types]
```

### Dependency Notes

- **Event QR requires Timezone Selector:** Without timezone, events display at wrong time for users in different zones. Critical for virtual events across timezones.

- **vCard requires Character Counter:** vCard has 1476 character limit in QR codes. Exceeding causes trimming/corruption. Real-time counter prevents this mistake.

- **WhatsApp/Telegram require Phone Validator:** International format (E.164) without +, spaces, or dashes is error-prone. Country code selector + validation prevents broken links.

- **WiFi requires Special Character Escaper:** Characters ; : , \ " must be escaped with backslash per MECARD standard. Auto-escaping prevents users from generating broken QR codes.

- **Standard Logo Library enhances all types:** Pre-loaded WhatsApp, Telegram, WiFi, Calendar, Contact icons improve branding without requiring logo upload flow.

- **All types benefit from Live Preview:** Existing preview system can display all QR types. No new preview infrastructure needed.

---

## MVP Definition for v1.1

### Launch With (v1.1 Release)

Minimum viable implementation for each QR type.

#### vCard
- [x] Name (first name, last name, full name fields)
- [x] Phone number (at least one, with format validation)
- [x] Email (at least one, with email validation)
- [x] Organization/Company field
- [x] Job title field
- [x] Website URL (with URL validation)
- [x] UTF-8 encoding support
- [x] Character counter showing X/1476 limit
- [x] Warning when approaching character limit
- [x] vCard 3.0 format output

#### WhatsApp
- [x] Phone number input
- [x] Country code selector dropdown
- [x] International format validation (E.164)
- [x] Strip spaces, dashes, parentheses automatically
- [x] Optional pre-filled message field
- [x] URL encode message (spaces to +)
- [x] Clear error messages ("Include country code: 1 for US, 44 for UK")

#### Telegram
- [x] Username input (primary option)
- [x] Username format validation (5-32 chars, alphanumeric + underscore)
- [x] Strip @ symbol if user includes it
- [x] Alternative: phone number option (with country code selector)
- [x] Toggle between username/phone mode
- [x] Generate t.me/{username} or t.me/+{phone} format
- [x] Clear help text ("Enter username without @ symbol")

#### Events/Calendar
- [x] Event title/summary (required, max 255 chars)
- [x] Start date picker
- [x] Start time picker
- [x] End date picker
- [x] End time picker
- [x] Timezone selector dropdown (with common zones + UTC)
- [x] Location field (max 255 chars)
- [x] Optional description field
- [x] Validation: end time after start time
- [x] iCalendar (.ics) format output with VERSION:2.0
- [x] Format dates as YYYYMMDDTHHMMSSZ

#### WiFi
- [x] SSID input (network name, case-sensitive)
- [x] Password input (case-sensitive, show/hide toggle)
- [x] Encryption type selector: WPA/WPA2/WPA3/WEP/None
- [x] Default to WPA2
- [x] Hidden SSID checkbox
- [x] Auto-escape special characters ( ; : , \ " )
- [x] Validation: password required if encryption != none
- [x] Validation: WPA password must be 8+ characters
- [x] Format output: WIFI:T:{type};S:{ssid};P:{password};H:{hidden};;
- [x] Clear help text about case-sensitivity

#### Standard Logo Library
- [x] 10-15 pre-loaded SVG icons:
  - WhatsApp logo
  - Telegram logo
  - WiFi icon
  - Calendar icon
  - Contact/vCard icon
  - Email icon
  - Phone icon
  - Location pin
  - Plus 5-7 generic icons (checkmark, arrow, etc.)
- [x] Integrate into existing logo selector UI
- [x] SVG format for scalability
- [x] Consistent sizing (square, centered)

#### Cross-Cutting Features (Reuse Existing)
- [x] Live preview updates as user types
- [x] Integration with existing color/gradient customization
- [x] Integration with existing dot styles/corner patterns
- [x] PNG/SVG export (reuse existing export system)
- [x] URL hash configuration sharing (extend to include new types)
- [x] Error correction level auto-selection (H for logo overlay)

#### New Cross-Cutting Features
- [x] Field-level validation with helpful error messages
- [x] Format helpers (country code selector, timezone picker, date/time pickers)
- [x] "Copy encoded data" button (show raw QR string for debugging)
- [x] Character counter component (for vCard)
- [x] Special character auto-escaping (for WiFi)

### Defer to v1.2+

Features to add after v1.1 ships and user feedback is gathered.

#### vCard Enhancements (v1.2)
- [ ] Multiple phone numbers (mobile, work, home)
- [ ] Multiple email addresses (personal, work)
- [ ] Structured physical address fields (street, city, state, zip, country)
- [ ] Notes/additional info field
- [ ] Job department/team field
- [ ] Download as .vcf file (in addition to QR code)

#### WhatsApp Enhancements (v1.2)
- [ ] Phone number formatter (auto-add country code as user types)
- [ ] Recent country codes (remember last used)
- [ ] Validate phone number with WhatsApp API (check if number exists)

#### Telegram Enhancements (v1.2)
- [ ] Bot parameter support (?start={param})
- [ ] Channel/group invite link support
- [ ] Validate username exists via Telegram API

#### Event Enhancements (v1.2)
- [ ] All-day event checkbox
- [ ] Recurring event support (RRULE)
- [ ] Event reminder/alarm
- [ ] Organizer name/email
- [ ] Attendees list
- [ ] Virtual meeting link in description

#### WiFi Enhancements (v1.2)
- [ ] Network type hint (2.4GHz vs 5GHz in description)
- [ ] WPA3 password strength indicator
- [ ] Test connection button (if WebRTC available)

#### Cross-Type Enhancements (v1.2+)
- [ ] Template system: save common configs ("Office WiFi", "Personal vCard")
- [ ] Template library: 5-10 pre-configured templates
- [ ] Import from file (.vcf, .ics, etc.)
- [ ] Batch generation (multiple QR codes from CSV)
- [ ] QR code comparison view (side-by-side multiple types)

### Future Consideration (v2.0+)

Features to defer until product-market fit is established.

- [ ] vCard Plus with social media links (LinkedIn, Twitter, Instagram, etc.)
- [ ] vCard photo/avatar support (bloats QR size significantly)
- [ ] Dynamic QR codes (requires backend, contradicts static-first philosophy)
- [ ] Analytics per QR type (privacy concerns)
- [ ] Multi-language support for UI (English-first for MVP)
- [ ] API access for programmatic generation
- [ ] Custom calendar providers (beyond iCal standard)
- [ ] QR code design templates marketplace
- [ ] Real-time scannability test (WebRTC camera access)

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| vCard basic fields (name, phone, email, org, title, URL) | HIGH | LOW | P1 |
| WhatsApp phone + message | HIGH | MEDIUM | P1 |
| Telegram username | HIGH | LOW | P1 |
| Event with timezone | HIGH | MEDIUM | P1 |
| WiFi with encryption types | HIGH | MEDIUM | P1 |
| Field validation with helpful errors | HIGH | MEDIUM | P1 |
| Standard logo library (10-15 icons) | MEDIUM | MEDIUM | P1 |
| Format helpers (country code, timezone, date pickers) | HIGH | MEDIUM | P1 |
| UTF-8 encoding (vCard) | HIGH | LOW | P1 |
| Special char escaping (WiFi) | HIGH | MEDIUM | P1 |
| Character counter (vCard) | HIGH | LOW | P1 |
| Copy encoded data button | MEDIUM | LOW | P1 |
| Live preview (extend existing) | HIGH | LOW | P1 |
| vCard multiple phones/emails | MEDIUM | MEDIUM | P2 |
| vCard physical address fields | MEDIUM | MEDIUM | P2 |
| Telegram bot parameters | LOW | LOW | P2 |
| Event description field | MEDIUM | LOW | P2 |
| Event recurring support | LOW | HIGH | P2 |
| Download .vcf file | MEDIUM | LOW | P2 |
| Template system | MEDIUM | MEDIUM | P2 |
| Phone number formatter | LOW | MEDIUM | P2 |
| vCard Plus social media | MEDIUM | HIGH | P3 |
| Import from file (.vcf, .ics) | LOW | MEDIUM | P3 |
| Batch generation | LOW | HIGH | P3 |
| Analytics/tracking | LOW | HIGH | P3 |
| Dynamic QR codes | LOW | HIGH | P3 |

**Priority key:**
- **P1:** Must have for v1.1 launch - core functionality
- **P2:** Should have in v1.2+ - enhances usability based on user feedback
- **P3:** Nice to have in v2+ - future consideration, requires validation

---

## QR Type Specific Validation Requirements

### vCard Validation

| Field | Validation Rule | Error Message | When to Show |
|-------|----------------|---------------|--------------|
| Total character count | Max 1476 characters | "vCard too long (1523/1476). Shorten content or remove optional fields." | Real-time, turns red at >1476 |
| Name | At least one name field required (first, last, or full) | "Name is required. Enter first name, last name, or full name." | On submit if all empty |
| Phone | Valid phone format (digits, +, -, (), spaces allowed) | "Enter valid phone number (e.g., +1 234-567-8900)" | On blur |
| Email | Valid email format (x@y.z) | "Enter valid email address (e.g., name@example.com)" | On blur |
| URL | Valid URL format (http:// or https://) | "Enter valid URL starting with http:// or https://" | On blur |
| Special characters | UTF-8 encodable (warn on unusual chars) | "Character '{char}' may not display correctly on all devices" | Real-time warning (non-blocking) |

### WhatsApp Validation

| Field | Validation Rule | Error Message | When to Show |
|-------|----------------|---------------|--------------|
| Phone number | Required | "Phone number is required" | On submit if empty |
| Country code | Required (selected from dropdown) | "Select country code (e.g., United States +1)" | On submit if not selected |
| Phone format | Digits only after country code (auto-strip other chars) | "(Auto-correcting) Removing spaces, dashes, and special characters" | Real-time info (non-blocking) |
| Phone length | Min 7 digits after country code | "Phone number too short. Include area code and number." | On blur |
| Message | URL-safe (auto-encode special chars) | "(Auto-encoding) Special characters will be URL-encoded" | Real-time info (non-blocking) |

### Telegram Validation

| Field | Validation Rule | Error Message | When to Show |
|-------|----------------|---------------|--------------|
| Username | Required if username mode | "Username is required" | On submit if empty |
| Username format | 5-32 characters, alphanumeric + underscore only | "Username must be 5-32 characters (letters, numbers, underscore only)" | On blur |
| Username @ symbol | Auto-strip if included | "(Auto-correcting) Removing @ symbol" | Real-time info (non-blocking) |
| Phone (if used) | Same as WhatsApp phone validation | Same as WhatsApp | On blur |

### Event/Calendar Validation

| Field | Validation Rule | Error Message | When to Show |
|-------|----------------|---------------|--------------|
| Title | Required, max 255 characters | "Event title is required" | On submit if empty |
| Title length | Max 255 characters | "Title too long (287/255 characters)" | Real-time at >255 |
| Start date/time | Required, valid datetime | "Enter valid start date and time" | On submit if empty |
| End date/time | Required, valid datetime | "Enter valid end date and time" | On submit if empty |
| End after start | End datetime must be after start datetime | "End time must be after start time" | On blur of end time |
| Timezone | Required (selected from dropdown) | "Select timezone to ensure correct time across time zones" | On submit if not selected |
| Location | Max 255 characters | "Location too long (287/255 characters)" | Real-time at >255 |

### WiFi Validation

| Field | Validation Rule | Error Message | When to Show |
|-------|----------------|---------------|--------------|
| SSID | Required, max 32 characters | "Network name (SSID) is required" | On submit if empty |
| SSID length | Max 32 characters | "Network name too long (38/32 characters)" | Real-time at >32 |
| SSID case-sensitive | Info message | "Network name is case-sensitive (MyNetwork != mynetwork)" | Help text always visible |
| Password | Required if encryption != none | "Password required for secured networks" | On submit if empty and not open |
| Password length (WPA) | Min 8 characters for WPA/WPA2/WPA3 | "WPA password must be at least 8 characters" | On blur if <8 |
| Password case-sensitive | Info message | "Password is case-sensitive (Password123 != password123)" | Help text always visible |
| Special chars | Auto-escape ; : , \ " | "(Auto-escaping) Special characters ; : , \\ \" will be escaped" | Real-time info when detected |
| Encryption type | One must be selected | "Select network encryption type (WPA2 recommended for most networks)" | On submit if none selected |

---

## User Expectations Per QR Type

### vCard QR Codes

**Primary Use Case:** Digital business card, networking events, email signatures

**User Journey:**
1. Person A shares vCard QR on business card / email signature / conference badge
2. Person B scans QR with phone camera
3. Phone opens Contacts app with pre-filled contact info
4. Person B taps "Save Contact" or "Add to Contacts"
5. Contact saved instantly, no typing required

**User Expects:**
- Scan → Opens contacts app → Save contact
- All business card info (name, title, company, phone, email, website)
- Works on both iOS (14+) and Android (10+) natively
- Quick save, no manual data entry
- Contact appears in phone's address book immediately

**Common User Errors We Must Prevent:**
- Adding too much information (resume-length descriptions) → character counter + warning
- Using special characters without UTF-8 encoding → auto-enable UTF-8
- Forgetting organization/title (context loss) → mark as "recommended" fields
- Exceeding 1476 character limit → real-time counter + blocking error

**Best Practices to Surface in UI:**
- "Keep it to business card equivalent - name, title, company, contact info"
- "Character limit: 1476 (currently: 847/1476)" in real-time
- "Test scan on both iPhone and Android before printing"
- "Use UTF-8 for international characters" (auto-enabled)
- "Add website URL to link to full LinkedIn/portfolio"

### WhatsApp QR Codes

**Primary Use Case:** Business customer support, marketing campaigns, personal contact sharing

**User Journey:**
1. Business shares WhatsApp QR on poster / website / product packaging
2. Customer scans QR with phone camera
3. Phone opens WhatsApp app
4. Chat with business opens, message pre-filled (if provided)
5. Customer taps "Send" to start conversation
6. Business receives message, conversation begins

**User Expects:**
- Scan → Opens WhatsApp → Pre-filled message → Send
- Direct to specific business number (not personal number in business context)
- Optional conversation starter ("Hi, I'm interested in...")
- Instant connection, no number typing

**Common User Errors We Must Prevent:**
- Including + symbol in phone number → auto-strip
- Including spaces, dashes, or parentheses → auto-strip
- Wrong country code format → force dropdown selection
- Forgetting country code entirely → make dropdown required

**Best Practices to Surface in UI:**
- "Country code is mandatory - select from dropdown"
- "Phone number format: digits only (we'll auto-remove spaces and dashes)"
- "Pre-filled message example: 'Hi, I'd like to know more about...'"
- "Test the QR code before printing - scan and check it opens WhatsApp correctly"

### Telegram QR Codes

**Primary Use Case:** Community building, channel promotion, bot activation, personal contact

**User Journey:**
1. Person/business shares Telegram QR on social media / website / event
2. User scans QR with phone camera
3. Phone opens Telegram app
4. Chat/channel/bot opens
5. User taps "Start" or "Join" to connect
6. Conversation or channel membership begins

**User Expects:**
- Scan → Opens Telegram → Start chat/join channel
- Username-based (most common) or phone-based (alternative)
- For bots: activation with optional parameters (defer to v1.2)
- Instant connection to correct Telegram entity

**Common User Errors We Must Prevent:**
- Including @ symbol in username → auto-strip
- Username too short (<5 chars) or too long (>32 chars) → validation
- Using invalid characters (only alphanumeric + underscore allowed) → validation
- Using phone without country code → same validation as WhatsApp
- Wrong link format (tg:// vs t.me) → always use t.me (universal)

**Best Practices to Surface in UI:**
- "Enter username without @ symbol (e.g., 'johndoe' not '@johndoe')"
- "Username must be 5-32 characters (letters, numbers, underscore)"
- "Alternatively, use phone number with country code"
- "We use t.me links (works in all browsers and apps)"

### Event/Calendar QR Codes

**Primary Use Case:** Event invitations, meeting scheduling, conference registration, webinars

**User Journey:**
1. Organizer shares Event QR on invitation / email / poster
2. Attendee scans QR with phone camera
3. Phone opens calendar app (Google Calendar, Apple Calendar, Outlook)
4. Event details load with correct time in attendee's timezone
5. Attendee taps "Save" or "Add to Calendar"
6. Event appears in attendee's calendar with reminder

**User Expects:**
- Scan → Opens calendar → Save event with all details
- Correct time in their local timezone (critical!)
- Location with address (or virtual meeting link)
- Event title, date, time, location pre-filled
- No manual entry required

**Common User Errors We Must Prevent:**
- Forgetting timezone → event shows wrong time for users in different zones → make required
- Swapping start/end times → validation: end must be after start
- Missing location for virtual events → field is optional but recommended
- Wrong date format → use date/time pickers (no manual entry)

**Best Practices to Surface in UI:**
- "Timezone is required - ensures correct time for all attendees"
- "For virtual events, add meeting link in Location or Description"
- "End time must be after start time"
- "Test on multiple calendar apps (Google, Apple, Outlook)"
- "Date format: automatically handled by date/time picker"

### WiFi QR Codes

**Primary Use Case:** Guest WiFi sharing, office onboarding, cafe/restaurant access, Airbnb check-in

**User Journey:**
1. Host shares WiFi QR at entrance / welcome packet / table tent
2. Guest scans QR with phone camera
3. Phone shows "Connect to {Network Name}?" prompt
4. Guest taps "Connect" or "Join"
5. Phone auto-connects to WiFi network
6. Internet access granted, no password typing required

**User Expects:**
- Scan → Prompt "Connect to network?" → Auto-connect
- Works immediately without manual password entry
- Supports modern security (WPA2/WPA3)
- No troubleshooting required

**Common User Errors We Must Prevent:**
- Wrong SSID case (MyNetwork vs mynetwork) → show warning about case-sensitivity
- Wrong password case → show warning about case-sensitivity
- Special characters in password breaking QR → auto-escape ; : , \ "
- Forgetting to mark hidden SSID → checkbox with clear label
- Password too short for WPA (<8 chars) → validation

**Best Practices to Surface in UI:**
- "Network name and password are case-sensitive"
- "Special characters (; : , \\ \") are automatically escaped"
- "Use WPA2 or WPA3 for security (WPA2 is default)"
- "Check 'Hidden SSID' if your network doesn't broadcast its name"
- "WPA password must be at least 8 characters"
- "Test scan before printing - ensure it connects successfully"

---

## Common Cross-Type Patterns

### Input Validation Patterns

**1. Real-time validation** - Show errors as user types, not just on submit
- Character counter updates live (vCard)
- Phone number auto-correction feedback (WhatsApp, Telegram)
- Date/time conflict detection (Events)
- Password strength indicator (WiFi)

**2. Helpful error messages** - Explain what's wrong AND how to fix it
- ❌ "Invalid phone number"
- ✅ "Phone number must include country code (e.g., 1 for US, 44 for UK)"

**3. Format helpers** - Guide users to correct format
- Country code dropdown (WhatsApp, Telegram)
- Date/time pickers (Events)
- Timezone selector with search (Events)
- Encryption type selector with descriptions (WiFi)

**4. Character counters** - Show limits before they're exceeded
- "847/1476 characters" for vCard (green if <1200, yellow if 1200-1476, red if >1476)
- "32/255 characters" for event title/location
- "8/32 characters" for WiFi SSID

**5. Auto-formatting** - Correct input automatically when safe
- Strip @ symbol from Telegram username
- Remove +, spaces, dashes from phone numbers
- Escape special characters in WiFi password
- URL-encode WhatsApp message text

### UX Patterns

**1. Required field indicators** - Clear marking of mandatory vs optional
- Red asterisk (*) for required fields
- "Optional" label for nice-to-have fields
- Disable submit button until required fields are valid

**2. Field descriptions** - Short helper text under inputs
- Under SSID: "Network name (case-sensitive, max 32 characters)"
- Under WhatsApp message: "Optional pre-filled message (will be URL-encoded)"
- Under event timezone: "Ensures correct time for attendees across time zones"

**3. Preview before download** - Show QR, allow test scan
- Live preview updates as user types (reuse existing preview)
- "Scan with your phone to test before downloading" prompt
- Preview shows what will be encoded (transparency)

**4. Copy data option** - Let power users see/copy encoded string
- "Copy encoded data" button below preview
- Shows raw vCard, iCal, or WIFI: string
- Useful for debugging and transparency

**5. Example values** - Placeholder text showing correct format
- Phone input: "12025551234"
- Telegram username: "johndoe"
- SSID: "MyNetwork"
- Event title: "Team Meeting"

### Error Prevention Patterns

**1. Disable submit until valid** - Can't generate broken QR codes
- Submit button is grayed out until all required fields are valid
- Hover tooltip explains what's missing: "Phone number required"

**2. Contrast warnings** - Alert on color combinations that reduce scannability (reuse existing)
- "Warning: Low contrast may reduce scannability. Use darker foreground or lighter background."

**3. Size warnings** - Character count approaching limit
- vCard at 1200+ chars: "Warning: Approaching character limit. Large QR codes may be harder to scan."

**4. Format auto-correction** - Strip invalid characters automatically when safe
- Phone numbers: remove non-digits
- Telegram username: remove @ symbol
- Show "(Auto-correcting)" message so user knows what happened

**5. Confirmation for edge cases** - Warn before generating potentially problematic QR
- WiFi with no password: "Are you sure? Open networks are less secure."
- vCard >1200 chars: "Large QR codes may be harder to scan. Consider shortening."

---

## Competitor Feature Analysis

| Feature | QR Code Monkey | QR Code Generator PRO | Flowcode | Our v1.1 |
|---------|----------------|----------------------|----------|----------|
| **vCard QR** | Basic fields only | Full vCard fields | Dynamic vCard Plus | Basic + UTF-8 + char counter |
| vCard social media | No | Yes (paid) | Yes | No (defer to v2) |
| vCard multi-field | No | No | Yes | No (defer to v1.2) |
| vCard char counter | No | No | No | **Yes** (differentiator) |
| **WhatsApp QR** | Phone + message | Phone + message | Phone + message | Phone + message + country selector |
| Country code helper | No | No | Basic | **Dropdown with search** |
| Phone validation | Basic | Basic | Good | **Helpful errors** |
| **Telegram QR** | No | Username only | Username + phone | Username + phone toggle |
| Auto-strip @ | No | No | Yes | **Yes** |
| **Event QR** | Basic iCal | Full iCal | Dynamic events | Basic iCal + **timezone required** |
| Timezone selector | No | Basic | Good | **With search + common zones** |
| Recurring events | No | Yes | Yes | No (defer to v1.2) |
| **WiFi QR** | WPA/WPA2 | WPA/WPA2/WPA3 | WPA/WPA2/WPA3 | WPA/WPA2/WPA3 |
| Special char escaping | Manual | Manual | Automatic | **Automatic + show message** |
| Hidden SSID | Yes | Yes | Yes | Yes |
| **Logo Library** | No | Limited (paid) | Limited (paid) | **Yes, 10-15 icons free** |
| **Live Preview** | Static | Dynamic | Dynamic | **Dynamic (extend existing)** |
| **Copy Encoded Data** | No | No | No | **Yes** (differentiator) |
| **Validation UX** | Basic | Good | Good | **Helpful + educational** |
| **Export Formats** | PNG/SVG | PNG/SVG/PDF/EPS | PNG only | PNG/SVG (existing) |
| **Privacy** | Static only | Dynamic (tracking) | Dynamic (tracking) | **Static only** |

**Key Differentiators for v1.1:**

1. **Standard logo library (free)** - Competitors charge for logos or limit to paid tiers. We include 10-15 common icons for all QR types.

2. **Character counter for vCard** - No competitor shows real-time character count. Prevents common mistake of creating oversized QR codes.

3. **Copy encoded data button** - Transparency and debugging. Power users can see exactly what's encoded.

4. **Helpful validation with education** - Not just "Invalid phone number" but "Phone must include country code (e.g., 1 for US, 44 for UK)". Teach users the format.

5. **Auto-escaping with feedback** - WiFi passwords with special characters just work. Show "(Auto-escaping)" message so users understand what happened.

6. **Format helpers reduce errors** - Country code dropdown, timezone search, date/time pickers. Less manual entry = fewer errors.

7. **Privacy-first static QR** - No tracking, no redirect, no expiration. Differentiates from 90% of market.

**Where we intentionally defer:**

- vCard Plus with social media (v2.0+)
- Recurring events (v1.2)
- Telegram bot parameters (v1.2)
- Multiple phones/emails for vCard (v1.2)
- Download .vcf file (v1.2)
- Template system (v1.2)

**Why we're competitive:**

- **Better UX** - Validation helps users succeed, not just reject bad input
- **Transparency** - Copy encoded data builds trust
- **Privacy** - Static-only is a feature, not a limitation
- **Free features** - Logo library, helpers, validation usually paywalled elsewhere

---

## Implementation Complexity Assessment

| QR Type | Overall Complexity | Reasoning | Estimated Dev Time |
|---------|-------------------|-----------|-------------------|
| **vCard** | MEDIUM | Multiple fields, UTF-8 encoding, character counting, format spec | 3-4 days |
| **WhatsApp** | MEDIUM | Phone validation, country code selector, URL encoding | 2-3 days |
| **Telegram** | LOW | Simple username validation, phone option reuses WhatsApp logic | 1-2 days |
| **Events** | MEDIUM-HIGH | Date/time pickers, timezone selector, iCal format, validation | 4-5 days |
| **WiFi** | MEDIUM | Special character escaping, encryption types, format spec | 2-3 days |
| **Logo Library** | MEDIUM | Create/source 10-15 SVG icons, integration into existing UI | 2-3 days |
| **Validation Framework** | MEDIUM | Reusable validation patterns, error messaging system | 2-3 days |
| **Format Helpers** | MEDIUM | Country code dropdown, timezone selector, date/time pickers | 3-4 days |
| **Copy Data Feature** | LOW | Button + copy to clipboard functionality | 0.5-1 day |
| **Character Counter** | LOW | Real-time counting component | 0.5-1 day |

**Total Estimated Time:** 20-28 days (4-6 weeks for solo developer)

**Critical Path:**
1. Validation framework (enables all types)
2. Format helpers (country code, timezone, date/time pickers)
3. vCard implementation (most complex)
4. Events implementation (second most complex)
5. WhatsApp, Telegram, WiFi (simpler, can be parallelized)
6. Logo library (can be done in parallel with QR types)
7. Copy data + character counter (final polish)

**Technical Risk Areas:**

**Low Risk:**
- Telegram (simple format, minimal validation)
- WiFi (established format, auto-escaping is straightforward)
- Copy data button (browser clipboard API is well-supported)

**Medium Risk:**
- vCard (complex spec, UTF-8 encoding edge cases, character limit management)
- WhatsApp (phone validation edge cases, international format complexity)
- Logo library (need to source/create quality SVG icons)

**High Risk:**
- Events (timezone handling across browsers, iCal format edge cases, date/time UX)
- Validation framework (must be extensible, reusable, user-friendly)

**Mitigation Strategies:**

1. **Events timezone handling** - Use established library (moment-timezone or date-fns-tz), test across timezones
2. **vCard character limit** - Test with edge cases (emoji, multi-byte UTF-8 characters)
3. **Phone validation** - Use libphonenumber-js for validation, test international numbers
4. **Validation framework** - Build incrementally, start with one QR type, extract patterns

**Quick Wins (Low effort, high value):**
- Copy encoded data button (0.5 days, high transparency value)
- Character counter component (0.5 days, prevents major user errors)
- Telegram username validation (1 day, completes a QR type)
- WiFi auto-escaping (1 day, prevents common errors)

---

## Sources

### vCard QR Codes
- [How to create QR codes for vCards | QuickChart](https://quickchart.io/documentation/vcard-qr-codes/)
- [Understanding the QR Code vCard Format: Best Practices](https://qrcodesunlimited.com/academy/use-cases/understanding-the-qr-code-vcard-format)
- [vCard & Contacts: Common Mistakes with QR Codes (and Fixes) | StrongQRCode](https://strongqrcode.com/blog/posts/vcard--contacts-vcard--contacts-common-mistakes-with-qr-codes-and-fixes.html)
- [Free vCard QR Code Generator | QR Code Generator](https://www.qr-code-generator.com/solutions/vcard-qr-code/)
- [7 Best Practices To Generate A Good VCard QR code](https://dingdoong.io/vcard-qr-code/)
- [10 Common vcard Mistakes | Shirish Gupta](https://shirishgupta.com/10-common-vcard-mistakes/)

### WhatsApp QR Codes
- [Free WhatsApp QR Code Generator (for 2026): 2 Steps only!](https://www.delightchat.io/whatsapp-qr-code-generator)
- [Creating a QR code for your WhatsApp number | Wati.io Help Center](https://support.wati.io/en/articles/11463156-creating-a-qr-code-for-your-whatsapp-number)
- [WhatsApp number free validator | Wassenger](https://wassenger.com/whatsapp-number-validator)
- [About international phone number format | WhatsApp Help Center](https://faq.whatsapp.com/1294841057948784)
- [A Guide to WhatsApp QR Code Generation | QR Code Generator](https://www.qr-code-generator.com/solutions/whatsapp-qr-code/)

### Telegram QR Codes
- [How to Generate Telegram Deep Links and App QR Codes | URLgenius Blog](https://app.urlgeni.us/blog/telegram-app-deep-linking)
- [Telegram Link Generator | Guide by Umnico](https://umnico.com/blog/telegram-link-generator/)
- [Deep links - Telegram Core API](https://core.telegram.org/api/links)
- [Telegram QR Code: Create Telegram QR Code For Free | Me-QR](https://me-qr.com/qr-code-generator/telegram)

### Event/Calendar QR Codes
- [How to Create Calendar Event QR Codes | QuickChart](https://quickchart.io/documentation/qr-codes/calendar-event-qr-codes/)
- [Calendar QR Code: Simplify Event Sharing & Boost Attendance | Scanova](https://scanova.io/blog/calendar-qr-code/)
- [Event QR code generator - QR Code Dynamic](https://qrcodedynamic.com/qr/event)
- [QR Code Calendar Event](https://blog.qr4.nl/QR-Code-Calendar-Event.aspx)
- [QR Code For Calendar Event | Me-QR](https://me-qr.com/qr-code-generator/calendar)

### WiFi QR Codes
- [How to format that WiFi QR code in plain text - Pocketables](https://pocketables.com/2022/01/how-to-format-that-wifi-qr-code-in-plain-text.html)
- [Encoding your WiFi access point password into a QR code](https://feeding.cloud.geek.nz/posts/encoding-wifi-access-point-passwords-qr-code/)
- [How to Create WiFi QR Codes | QuickChart](https://quickchart.io/documentation/qr-codes/wifi-qr-codes/)
- [WiFi QR Code: Share Your Network Without Typing Passwords | QR Code Maker](https://qr-code-maker.app/wifi-qr-code)
- [WiFi QR Code Generator | QR Code Generator](https://www.qr-code-generator.com/solutions/wifi-qr-code/)

### QR Code Generator UX & Features
- [QR Code Test: The Easy Way to Create QR Codes That Work | Uniqode](https://www.uniqode.com/blog/qr-code-best-practices/qr-code-test)
- [QR Code Testing Checklist: 3 Things To Assess | QR Code Generator](https://www.qr-code-generator.com/blog/qr-code-testing/)
- [The Top 10 QR Code Generators for 2026 | Sellbery](https://sellbery.com/blog/the-top-10-qr-code-generators-for-2026-guide-examples-and-best-features/)
- [Top 7 dynamic QR code generators in 2026 | Jotform](https://www.jotform.com/blog/dynamic-qr-code-generators/)
- [Sample QR Codes for Testing Different QR Solutions](https://www.qrcode-tiger.com/sample-qr-codes-for-testing)
- [How to Test QR Code UX: The Dos and Don'ts](https://www.usertesting.com/blog/how-test-qr-code-ux)

### Advanced vCard Features
- [Free vCard QR Code Generator | QR Code Generator](https://www.qr-code-generator.com/solutions/vcard-qr-code/)
- [How to Create a Business Card with Social Media Links](https://www.qrcode-tiger.com/business-card-with-social-media-links)
- [Dynamic vCard QR Code: Make a Digital, Appealing Business Card](https://www.qrcodechimp.com/dynamic-vcard-qr-code/)
- [vCard Plus - A Quick Guide | QRCodeChimp](https://www.qrcodechimp.com/vcard-plus/)

---

*Feature research for: QR Code Generator v1.1 - vCard, WhatsApp, Telegram, Events, WiFi QR codes*
*Researched: 2026-01-27*
*Confidence: MEDIUM - Research based on web search verified with multiple authoritative sources (official documentation, established QR generators, format specifications). Technical formats verified where official specs available (iCal, vCard, WIFI:). User expectations based on cross-referenced UX best practices and competitor analysis.*
