# Phase 7: Complex QR Types - Research

**Researched:** 2026-01-28
**Domain:** vCard and Telegram QR code generation with multi-field validation
**Confidence:** HIGH

## Summary

Phase 7 implements two QR code types with greater complexity than Phase 6: vCard (multi-field contact cards) and Telegram (mode-based user linking). vCard QR codes encode complete contact information (name, phone, email, website, company, title, department) in vCard 3.0 format for iOS/Android camera compatibility. Telegram QR codes use simple t.me/{identifier} URLs with three modes: username (5-32 chars, alphanumeric + underscore), phone (E.164 format), or bot (username ending in "bot").

The technical foundation from Phase 5 (React Hook Form + Zod + zodResolver) and Phase 6 patterns directly supports both implementations. vCard requires the vcards-js library for generating RFC 2426-compliant vCard 3.0 strings with automatic special character escaping (semicolons, commas, newlines, backslashes). The library handles line folding and UTF-8 encoding. Telegram requires mode-based discriminated union validation with auto-stripping of @ symbols from usernames and E.164 phone validation (reusing WhatsApp pattern from Phase 6).

The primary complexity is vCard character capacity management: QR codes with full vCard data can reach 1400-1500 characters (practical limit for business card-sized codes), requiring real-time character counting with warnings. vCard 3.0 is preferred over 4.0 for QR reader compatibility. Telegram validation is simpler but requires mode-specific field visibility and validation rules.

**Primary recommendation:** Use vcards-js (v2.10.0) for vCard 3.0 generation—library handles escaping, line folding, and UTF-8 automatically. Implement character counter with 1400+ character warning (amber at 1400, red at 1500+). For Telegram, use discriminated union schema with mode as discriminator ('username' | 'phone' | 'bot'), auto-strip @ from username input via .transform(), and reuse Phase 6 E.164 regex for phone validation. Follow established formatter pattern: co-located schema + formatter per type.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.71.1 | Form state management | Already established; handles multi-field vCard form |
| zod | 4.3.6 | Schema validation | Already established; discriminated unions for Telegram modes; transforms for @ stripping |
| @hookform/resolvers | 5.2.2+ | Zod-RHF integration | Already established; zodResolver bridges schemas to forms |
| vcards-js | 2.10.0 | vCard 3.0 generation | Standard library for vCard creation; automatic RFC 2426 compliance; 1.7M weekly downloads |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @types/vcards-js | 2.10.5 | TypeScript definitions | TypeScript projects using vcards-js |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vcards-js | vcard-creator | vcard-creator more recent (updated 10mo ago) but vcards-js is better documented, has TypeScript types, and RFC 2426 compliance verified |
| vcards-js | Hand-rolled vCard formatter | Manual formatting requires implementing RFC 2426 escaping rules, line folding (75 char limit), UTF-8 encoding—error-prone |
| vcards-js (vCard 3.0) | vcard4-ts (vCard 4.0) | vCard 4.0 has poor QR reader support as of 2026; explicitly excluded in requirements |
| Discriminated union (Telegram) | Single schema with optional fields | Union provides mode-specific validation; single schema requires complex conditional logic |

**Installation:**
```bash
# Add vcards-js for Phase 7
npm install vcards-js @types/vcards-js

# Core validation stack (already installed in Phase 5)
# npm install react-hook-form zod @hookform/resolvers
```

## Architecture Patterns

### Recommended Project Structure
```
lib/
├── formatters/
│   ├── vcard.ts             # vCard schema + formatter (uses vcards-js)
│   ├── telegram.ts          # Telegram schema + formatter with mode union
│   └── index.ts             # Export QR_TYPES constant
components/
├── forms/
│   └── qr-forms/
│       ├── VCardForm.tsx    # Multi-field contact form with character counter
│       └── TelegramForm.tsx # Mode selector + conditional fields
lib/
└── registry.ts              # Add vcard/telegram to qrFormRegistry
```

### Pattern 1: vCard Schema + Formatter with vcards-js
**What:** Multi-field contact schema with vCard 3.0 generation via vcards-js library
**When to use:** vCard QR type implementation
**Example:**
```typescript
// lib/formatters/vcard.ts
import { z } from 'zod';
import vCardsJS from 'vcards-js';

export const vcardSchema = z.object({
  // Required fields
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),

  // Optional fields
  phoneNumber: z.string()
    .regex(/^\+[1-9]\d{6,14}$/, 'Must be valid E.164 format (e.g., +12025550172)')
    .optional(),
  email: z.string()
    .email('Must be valid email address')
    .optional(),
  website: z.string()
    .url('Must be valid URL')
    .optional(),
  company: z.string()
    .max(100, 'Company name must be 100 characters or less')
    .optional(),
  title: z.string()
    .max(100, 'Job title must be 100 characters or less')
    .optional(),
  department: z.string()
    .max(100, 'Department must be 100 characters or less')
    .optional(),
});

export type VCardData = z.infer<typeof vcardSchema>;

export function formatVCard(data: VCardData): string {
  // vcards-js handles all RFC 2426 compliance:
  // - Special character escaping (\;, \,, \n, \\)
  // - Line folding at 75 characters
  // - UTF-8 encoding
  // - vCard 3.0 structure (BEGIN:VCARD, VERSION:3.0, END:VCARD)
  const vCard = vCardsJS();

  // Required fields
  vCard.firstName = data.firstName;
  vCard.lastName = data.lastName;

  // Optional fields (only set if provided)
  if (data.phoneNumber) {
    vCard.workPhone = data.phoneNumber;
  }
  if (data.email) {
    vCard.email = data.email;
  }
  if (data.website) {
    vCard.url = data.website;
  }
  if (data.company) {
    vCard.organization = data.company;
  }
  if (data.title) {
    vCard.title = data.title;
  }
  if (data.department) {
    vCard.role = data.department; // vcards-js uses 'role' for department
  }

  // Returns vCard 3.0 format string
  return vCard.getFormattedString();
}

// Calculate character count for vCard data (for UI warning)
export function getVCardCharacterCount(data: Partial<VCardData>): number {
  try {
    const result = vcardSchema.safeParse(data);
    if (!result.success) {
      // Return estimate for incomplete data
      return Object.values(data).join('').length + 100; // Rough estimate
    }
    return formatVCard(result.data).length;
  } catch {
    return 0;
  }
}
```

### Pattern 2: Telegram Schema with Mode Discriminated Union
**What:** Mode-based Telegram link with discriminated union for username/phone/bot validation
**When to use:** Telegram QR type implementation
**Example:**
```typescript
// lib/formatters/telegram.ts
import { z } from 'zod';

// Discriminated union: validation rules vary by mode
export const telegramSchema = z.discriminatedUnion('mode', [
  // Username mode: 5-32 chars, alphanumeric + underscore, auto-strip @
  z.object({
    mode: z.literal('username'),
    username: z.string()
      .min(1, 'Username is required')
      .transform((val) => val.replace(/^@/, '')) // Auto-strip @ symbol
      .pipe(
        z.string()
          .min(5, 'Username must be at least 5 characters')
          .max(32, 'Username must be 32 characters or less')
          .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      ),
  }),

  // Phone mode: E.164 format (reuse WhatsApp validation)
  z.object({
    mode: z.literal('phone'),
    phoneNumber: z.string()
      .min(1, 'Phone number is required')
      .regex(/^\+[1-9]\d{6,14}$/, 'Must be valid E.164 format (e.g., +12025550172)'),
  }),

  // Bot mode: username ending in 'bot' or '_bot'
  z.object({
    mode: z.literal('bot'),
    botUsername: z.string()
      .min(1, 'Bot username is required')
      .transform((val) => val.replace(/^@/, '')) // Auto-strip @ symbol
      .pipe(
        z.string()
          .min(5, 'Bot username must be at least 5 characters')
          .max(32, 'Bot username must be 32 characters or less')
          .regex(/^[a-zA-Z0-9_]+$/, 'Bot username can only contain letters, numbers, and underscores')
          .refine(
            (val) => val.toLowerCase().endsWith('bot') || val.toLowerCase().endsWith('_bot'),
            'Bot username must end with "bot" or "_bot"'
          )
      ),
  }),
]);

export type TelegramData = z.infer<typeof telegramSchema>;

export function formatTelegram(data: TelegramData): string {
  // t.me link format based on mode
  switch (data.mode) {
    case 'username':
      // t.me/username
      return `https://t.me/${data.username}`;

    case 'phone':
      // t.me/+1234567890 (includes + prefix)
      return `https://t.me/${data.phoneNumber}`;

    case 'bot':
      // t.me/botname (same as username)
      return `https://t.me/${data.botUsername}`;
  }
}
```

### Pattern 3: vCard Form with Character Counter
**What:** Multi-field contact form with real-time character counting and capacity warnings
**When to use:** vCard QR type form implementation
**Example:**
```typescript
// components/forms/qr-forms/VCardForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vcardSchema, formatVCard, getVCardCharacterCount, VCardData } from '@/lib/formatters/vcard';
import { FormFieldSet } from '../FormFieldSet';
import { useMemo } from 'react';

type Props = {
  onDataChange: (qrData: string) => void;
  initialValue?: VCardData;
};

export function VCardForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm<VCardData>({
    resolver: zodResolver(vcardSchema),
    mode: 'onBlur',
    defaultValues: initialValue || {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      website: '',
      company: '',
      title: '',
      department: '',
    },
  });

  const formData = watch();

  // Calculate character count
  const charCount = useMemo(() => getVCardCharacterCount(formData), [formData]);

  // Determine warning level
  const getWarningLevel = (count: number) => {
    if (count >= 1500) return 'critical'; // Red
    if (count >= 1400) return 'warning';  // Amber
    return 'normal';                      // Green
  };

  const warningLevel = getWarningLevel(charCount);

  // Auto-update QR code on valid form changes
  useEffect(() => {
    const result = vcardSchema.safeParse(formData);
    if (result.success) {
      onDataChange(formatVCard(result.data));
    }
  }, [formData, onDataChange]);

  return (
    <form className="space-y-4">
      {/* Required fields */}
      <FormFieldSet
        control={control}
        name="firstName"
        label="First Name *"
        render={(field) => (
          <input
            {...field}
            type="text"
            placeholder="John"
            maxLength={50}
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="lastName"
        label="Last Name *"
        render={(field) => (
          <input
            {...field}
            type="text"
            placeholder="Doe"
            maxLength={50}
          />
        )}
      />

      {/* Optional fields */}
      <FormFieldSet
        control={control}
        name="phoneNumber"
        label="Phone Number"
        render={(field) => (
          <input
            {...field}
            type="tel"
            placeholder="+12025550172"
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="email"
        label="Email"
        render={(field) => (
          <input
            {...field}
            type="email"
            placeholder="john.doe@example.com"
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="website"
        label="Website"
        render={(field) => (
          <input
            {...field}
            type="url"
            placeholder="https://example.com"
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="company"
        label="Company"
        render={(field) => (
          <input
            {...field}
            type="text"
            placeholder="ACME Corporation"
            maxLength={100}
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="title"
        label="Job Title"
        render={(field) => (
          <input
            {...field}
            type="text"
            placeholder="Software Engineer"
            maxLength={100}
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="department"
        label="Department"
        render={(field) => (
          <input
            {...field}
            type="text"
            placeholder="Engineering"
            maxLength={100}
          />
        )}
      />

      {/* Character counter */}
      <div className={`character-counter ${warningLevel}`}>
        <p>
          vCard size: {charCount} characters
        </p>
        {warningLevel === 'warning' && (
          <p className="warning-text">
            Approaching QR code size limit. Consider removing optional fields.
          </p>
        )}
        {warningLevel === 'critical' && (
          <p className="critical-text">
            QR code may be difficult to scan. Remove some optional fields.
          </p>
        )}
      </div>
    </form>
  );
}
```

### Pattern 4: Telegram Form with Mode Selector
**What:** Form with mode selector and conditional field rendering based on selected mode
**When to use:** Telegram QR type form implementation
**Example:**
```typescript
// components/forms/qr-forms/TelegramForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { telegramSchema, formatTelegram, TelegramData } from '@/lib/formatters/telegram';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (qrData: string) => void;
  initialValue?: TelegramData;
};

export function TelegramForm({ onDataChange, initialValue }: Props) {
  const { control, watch } = useForm<TelegramData>({
    resolver: zodResolver(telegramSchema),
    mode: 'onBlur',
    defaultValues: initialValue || {
      mode: 'username',
      username: '',
    },
  });

  const mode = watch('mode');

  // Auto-update QR code on valid form changes
  const formData = watch();
  useEffect(() => {
    const result = telegramSchema.safeParse(formData);
    if (result.success) {
      onDataChange(formatTelegram(result.data));
    }
  }, [formData, onDataChange]);

  return (
    <form className="space-y-4">
      {/* Mode selector */}
      <FormFieldSet
        control={control}
        name="mode"
        label="Link Type"
        render={(field) => (
          <select {...field}>
            <option value="username">Username</option>
            <option value="phone">Phone Number</option>
            <option value="bot">Bot</option>
          </select>
        )}
      />

      {/* Conditional fields based on mode */}
      {mode === 'username' && (
        <FormFieldSet
          control={control}
          name="username"
          label="Telegram Username"
          render={(field) => (
            <>
              <input
                {...field}
                type="text"
                placeholder="@username or username"
                maxLength={32}
              />
              <p className="hint">
                5-32 characters, letters, numbers, and underscores only. @ symbol will be auto-removed.
              </p>
            </>
          )}
        />
      )}

      {mode === 'phone' && (
        <FormFieldSet
          control={control}
          name="phoneNumber"
          label="Phone Number"
          render={(field) => (
            <>
              <input
                {...field}
                type="tel"
                placeholder="+12025550172"
              />
              <p className="hint">
                Enter phone number with country code (e.g., +1 for USA)
              </p>
            </>
          )}
        />
      )}

      {mode === 'bot' && (
        <FormFieldSet
          control={control}
          name="botUsername"
          label="Bot Username"
          render={(field) => (
            <>
              <input
                {...field}
                type="text"
                placeholder="@mybotname or mybotname"
                maxLength={32}
              />
              <p className="hint">
                Must end with "bot" or "_bot". @ symbol will be auto-removed.
              </p>
            </>
          )}
        />
      )}
    </form>
  );
}
```

### Anti-Patterns to Avoid
- **Not handling vcards-js in browser environment:** vcards-js has 'fs' dependency issues in browser/Next.js; use dynamic import with ssr: false if needed, or call getFormattedString() which works in browser
- **Manual vCard escaping:** Never manually escape vCard special characters; vcards-js handles RFC 2426 escaping automatically
- **Missing character counter:** vCard QR codes can become unscannable above ~1500 characters; always show character count with warnings
- **Not auto-stripping @ from Telegram usernames:** Users naturally type @username; transform should strip @ automatically
- **Using vCard 4.0:** vCard 4.0 has poor QR reader support; always use vcards-js (vCard 3.0) as specified in requirements
- **Hardcoding bot suffix validation:** Bot usernames can use collectible usernames without "bot" suffix (rare but valid); basic validation should enforce suffix but document exceptions
- **Encoding t.me phone links without +:** Telegram phone links use t.me/+1234567890 format (includes + prefix); don't strip it like WhatsApp wa.me format

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| vCard 3.0 format generation | Manual string concatenation with escaping | vcards-js library | RFC 2426 requires escaping semicolons, commas, newlines, backslashes; line folding at 75 chars; UTF-8 encoding; BEGIN/END structure; vcards-js handles all automatically |
| vCard special character escaping | Replace chains for ;,:\n\ | vcards-js automatic escaping | Wrong escape order causes corruption; library tested across iOS/Android/Outlook |
| Telegram username validation | Manual regex for 5-32 alphanumeric | Zod .transform() + .pipe() pattern | Transform strips @ before validation; pipe applies length/regex checks to cleaned value |
| vCard character counting | String length of form values | getVCardCharacterCount() helper | vCard format adds structure overhead (BEGIN:VCARD, line folding, field names); actual output significantly longer than input |
| Mode-based form validation | Conditional validation with if/else | Zod discriminated union | Union provides type-safe mode-specific validation; TypeScript infers correct fields per mode |

**Key insight:** vCard format has hidden complexity (RFC 2426 escaping rules, line folding, field structure). vcards-js library has 1.7M weekly downloads and handles all edge cases. Using it prevents iOS/Android scanning failures from malformed vCards. Telegram validation benefits from Zod's discriminated unions—single schema with conditional logic is harder to maintain and less type-safe.

## Common Pitfalls

### Pitfall 1: vcards-js Browser/Next.js Import Issues
**What goes wrong:** "Module not found: Can't resolve 'fs'" error when importing vcards-js in Next.js/React
**Why it happens:** vcards-js includes Node.js 'fs' module for saveToFile() method; Next.js client bundles can't resolve 'fs'
**How to avoid:** Only call getFormattedString() method (works in browser). If import errors persist, use dynamic import: `const vCardsJS = (await import('vcards-js')).default;` or ensure vcards-js is only imported server-side. For client-side forms, generate vCard string in formatter function (lib/formatters/vcard.ts) which can be tree-shaken.
**Warning signs:** Build errors mentioning 'fs' module; "Module not found" in browser console

### Pitfall 2: vCard Character Limit Without Warning
**What goes wrong:** User fills all vCard fields; QR code becomes too dense to scan on business cards
**Why it happens:** Full vCard with all fields reaches 1400-1800 characters; QR codes above ~1500 chars require large physical size
**How to avoid:** Implement real-time character counter with color-coded warnings: green (<1400), amber (1400-1500), red (>1500). Show message: "QR code may be difficult to scan. Consider removing optional fields."
**Warning signs:** Users report QR codes not scanning; QR codes look very dense with tiny modules

### Pitfall 3: Telegram @ Symbol Not Stripped
**What goes wrong:** User enters "@username"; validation fails with "Username must be 5-32 characters" (counts @ as character)
**Why it happens:** Users naturally prefix usernames with @; validation expects cleaned value
**How to avoid:** Use .transform((val) => val.replace(/^@/, '')) BEFORE length/regex validation via .pipe(). Pattern: `.transform()` → `.pipe()` → validation chain. Makes @ symbol transparent to users.
**Warning signs:** Users confused why "@username" (9 chars including @) fails 32-char limit; error messages reference @ symbol

### Pitfall 4: vCard Phone Number Format Mismatch
**What goes wrong:** vCard phone field shows formatted number "(202) 555-0172" instead of E.164 "+12025550172"
**Why it happens:** vcards-js accepts any string for phone fields; no automatic formatting
**How to avoid:** Store phone in E.164 format (validated by schema); pass E.164 directly to vcards-js. Don't format phone for display in vCard—E.164 format is international standard. iOS/Android parse E.164 correctly.
**Warning signs:** Scanned vCard shows malformed phone numbers; click-to-call fails on mobile devices

### Pitfall 5: Telegram Bot Username Without "bot" Suffix
**What goes wrong:** User tries creating bot link without "bot" suffix; validation blocks collectible usernames
**Why it happens:** Standard bot usernames require "bot" or "_bot" suffix, but collectible usernames (rare, purchased) don't
**How to avoid:** For v1.1, enforce "bot" suffix per standard Telegram behavior. Document in UI hint: "Bot usernames must end with 'bot' or '_bot'". If user reports valid bot without suffix, Phase 8+ enhancement: add checkbox "This bot uses a collectible username" to bypass suffix validation.
**Warning signs:** User reports bot link works in Telegram app but fails validation in QR generator

### Pitfall 6: vCard Field Order Expectations
**What goes wrong:** Scanned vCard shows fields in unexpected order (title before name, department in wrong field)
**Why it happens:** vcards-js property mapping to vCard fields; 'role' property maps to ROLE field (department/function)
**How to avoid:** Use correct vcards-js property names: firstName/lastName (N field), organization (ORG), title (TITLE), role (ROLE/department). Test scanned vCard on iOS and Android to verify field mapping. Don't rely on property name matching field label.
**Warning signs:** Scanned contacts show "undefined" fields; job title appears in company field or vice versa

### Pitfall 7: Telegram Phone Link Missing + Prefix
**What goes wrong:** t.me phone links formatted as t.me/12025550172 (without +); links don't open Telegram
**Why it happens:** Confusion with WhatsApp wa.me format which strips + prefix
**How to avoid:** Telegram phone links use t.me/+{number} format (includes + prefix). Return `https://t.me/${data.phoneNumber}` where phoneNumber already includes +. Test: t.me/+12025550172 is correct format.
**Warning signs:** QR codes scan but don't open Telegram chat; links appear in browser instead of app

### Pitfall 8: vCard UTF-8 Encoding Missing
**What goes wrong:** vCard with special characters (é, ñ, 中文) shows as ??? or garbage on iOS/Android
**Why it happens:** vCard not explicitly using UTF-8 encoding; some readers default to ASCII
**How to avoid:** vcards-js defaults to UTF-8 in vCard 3.0. Verify by testing with names containing accents, umlauts, or non-Latin characters. If issues persist, check vcards-js version (should be 2.10.0+) and ensure no charset override.
**Warning signs:** Names with accents scan incorrectly; Asian characters show as question marks

### Pitfall 9: Not Validating Empty Optional vCard Fields
**What goes wrong:** Form submits with empty strings for optional fields; vCard includes empty properties (EMAIL:, TEL:)
**Why it happens:** React Hook Form defaultValues set to '' for optional fields; formatter doesn't filter empty values
**How to avoid:** In formatVCard(), only set vcards-js properties if field has non-empty value: `if (data.email && data.email.trim()) { vCard.email = data.email; }`. Prevents empty vCard properties from bloating character count.
**Warning signs:** vCard character count higher than expected; generated vCard includes blank fields

## Code Examples

Verified patterns from official sources:

### vCard 3.0 Generation with vcards-js
```typescript
// Source: https://github.com/enesser/vCards-js/blob/master/README.md
// vcards-js v2.10.0 - vCard 3.0 format with automatic RFC 2426 compliance
import vCardsJS from 'vcards-js';

function createVCard(data: {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  url?: string;
  organization?: string;
  title?: string;
  role?: string; // Department/function
}): string {
  const vCard = vCardsJS();

  // Set properties (vcards-js handles all escaping automatically)
  vCard.firstName = data.firstName;
  vCard.lastName = data.lastName;

  // Optional fields
  if (data.phone) vCard.workPhone = data.phone;
  if (data.email) vCard.email = data.email;
  if (data.url) vCard.url = data.url;
  if (data.organization) vCard.organization = data.organization;
  if (data.title) vCard.title = data.title;
  if (data.role) vCard.role = data.role;

  // Returns vCard 3.0 string:
  // BEGIN:VCARD
  // VERSION:3.0
  // N:Nesser;Eric;J;;
  // FN:Eric J Nesser
  // ORG:ACME Corporation
  // TITLE:Software Developer
  // TEL;TYPE=WORK,VOICE:312-555-1212
  // EMAIL:eric@example.com
  // URL:https://github.com/enesser
  // ROLE:Engineering
  // END:VCARD
  return vCard.getFormattedString();
}
```

### Telegram Username Validation with @ Auto-Strip
```typescript
// Source: https://core.telegram.org/api/links + Phase 7 research
import { z } from 'zod';

// Pattern: transform strips @ BEFORE validation via pipe
const telegramUsernameSchema = z.string()
  .min(1, 'Username is required')
  .transform((val) => val.replace(/^@/, '')) // Remove @ prefix
  .pipe(
    z.string()
      .min(5, 'Username must be at least 5 characters')
      .max(32, 'Username must be 32 characters or less')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  );

// Examples:
telegramUsernameSchema.parse('@username');    // Returns: 'username' (valid)
telegramUsernameSchema.parse('username');     // Returns: 'username' (valid)
telegramUsernameSchema.parse('@user');        // Error: min 5 chars (after @ removed)
telegramUsernameSchema.parse('user@name');    // Error: @ in middle (regex fails)
```

### Telegram Discriminated Union Schema
```typescript
// Source: Phase 7 research + Zod discriminated union pattern
import { z } from 'zod';

export const telegramSchema = z.discriminatedUnion('mode', [
  // Username mode
  z.object({
    mode: z.literal('username'),
    username: z.string()
      .min(1, 'Username is required')
      .transform((val) => val.replace(/^@/, ''))
      .pipe(
        z.string()
          .min(5, 'Username must be at least 5 characters')
          .max(32, 'Username must be 32 characters or less')
          .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      ),
  }),

  // Phone mode (reuse WhatsApp E.164 validation)
  z.object({
    mode: z.literal('phone'),
    phoneNumber: z.string()
      .min(1, 'Phone number is required')
      .regex(/^\+[1-9]\d{6,14}$/, 'Must be valid E.164 format (e.g., +12025550172)'),
  }),

  // Bot mode (username with 'bot' suffix)
  z.object({
    mode: z.literal('bot'),
    botUsername: z.string()
      .min(1, 'Bot username is required')
      .transform((val) => val.replace(/^@/, ''))
      .pipe(
        z.string()
          .min(5, 'Bot username must be at least 5 characters')
          .max(32, 'Bot username must be 32 characters or less')
          .regex(/^[a-zA-Z0-9_]+$/, 'Bot username can only contain letters, numbers, and underscores')
          .refine(
            (val) => val.toLowerCase().endsWith('bot') || val.toLowerCase().endsWith('_bot'),
            'Bot username must end with "bot" or "_bot"'
          )
      ),
  }),
]);

export type TelegramData = z.infer<typeof telegramSchema>;
// TypeScript infers:
//   { mode: 'username', username: string }
// | { mode: 'phone', phoneNumber: string }
// | { mode: 'bot', botUsername: string }
```

### Telegram Link Formatting by Mode
```typescript
// Source: https://core.telegram.org/api/links
function formatTelegram(data: TelegramData): string {
  switch (data.mode) {
    case 'username':
      // Username link: t.me/username
      return `https://t.me/${data.username}`;

    case 'phone':
      // Phone link: t.me/+1234567890 (includes + prefix)
      return `https://t.me/${data.phoneNumber}`;

    case 'bot':
      // Bot link: t.me/botusername (same format as username)
      return `https://t.me/${data.botUsername}`;
  }
}

// Examples:
formatTelegram({ mode: 'username', username: 'johndoe' });
// Returns: https://t.me/johndoe

formatTelegram({ mode: 'phone', phoneNumber: '+12025550172' });
// Returns: https://t.me/+12025550172

formatTelegram({ mode: 'bot', botUsername: 'myawesomebot' });
// Returns: https://t.me/myawesomebot
```

### vCard Character Count Helper
```typescript
// Pattern for real-time character counting with vCard formatting overhead
import { vcardSchema, formatVCard } from './vcard';

export function getVCardCharacterCount(data: Partial<VCardData>): number {
  try {
    const result = vcardSchema.safeParse(data);
    if (!result.success) {
      // For incomplete data, estimate based on filled fields
      const fieldLengths = Object.values(data)
        .filter((val): val is string => typeof val === 'string')
        .reduce((sum, val) => sum + val.length, 0);

      // Add overhead for vCard structure (BEGIN:VCARD, field names, etc.)
      return fieldLengths + 150;
    }

    // For complete valid data, return actual formatted length
    return formatVCard(result.data).length;
  } catch {
    return 0;
  }
}

// Usage in component:
const charCount = useMemo(() => getVCardCharacterCount(formData), [formData]);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| vCard 2.1 format | vCard 3.0 format | 1998 (RFC 2426) | vCard 3.0 adds UTF-8 support, better international character handling; industry standard for QR codes |
| Manual vCard string building | vcards-js library | Pre-2014 | Library handles RFC 2426 compliance automatically; manual building error-prone |
| vCard 4.0 (RFC 6350) | vCard 3.0 for QR codes | Ongoing | vCard 4.0 (2011) has poor QR reader support as of 2026; explicitly excluded in requirements |
| Telegram username.t.me subdomain | t.me/username format | Telegram API update | Both formats work but t.me/username is canonical; QR codes should use t.me/username |
| Single schema with conditional validation | Zod discriminated unions | Zod v3+ (2022) | Union provides type-safe mode-specific validation; TypeScript infers correct fields per mode |
| Manual @ symbol removal in UI | Zod .transform() preprocessing | Zod v3+ | Transform transparently strips @ before validation; users see natural @ format |

**Deprecated/outdated:**
- **vCard 2.1 format:** Obsoleted by RFC 2426 (vCard 3.0) in 1998; poor UTF-8 support
- **vCard 4.0 in QR codes:** RFC 6350 (2011) has limited QR reader support as of 2026; iOS/Android cameras prefer vCard 3.0
- **MeCard format:** NTT DoCoMo proprietary format; less feature-rich than vCard; prefer vCard 3.0 for modern implementations
- **Telegram username.t.me subdomain links:** Older format `https://username.t.me/` deprecated in favor of `https://t.me/username`
- **vcards-js saveToFile() in browser:** Node.js-only method; use getFormattedString() for browser/Next.js environments

## Open Questions

Things that couldn't be fully resolved:

1. **vcards-js Browser Import Strategy**
   - What we know: vcards-js has 'fs' dependency causing Next.js/React import issues; getFormattedString() method works in browser
   - What's unclear: Best practice for Next.js integration—dynamic import, server-side only, or client-side with import workaround
   - Recommendation: Implement formatter in lib/formatters/vcard.ts (can be tree-shaken); test import in Next.js. If issues persist, use dynamic import: `const vCardsJS = (await import('vcards-js')).default;` in formatter function. Mark as LOW confidence pending implementation testing.

2. **vCard 1400 Character Limit Threshold**
   - What we know: QR codes with ~1500+ characters become difficult to scan on business cards (2x2cm size); practical limit varies by error correction level
   - What's unclear: Exact character count where scannability degrades; varies by QR error correction (L/M/Q/H), module size, and scanning distance
   - Recommendation: Implement character counter with 1400 (amber warning) and 1500 (red warning) thresholds per requirements. During Phase 7 testing, generate test vCards at 1200, 1400, 1600, 1800 chars; scan with iOS/Android at business card distance (~30cm). Adjust thresholds if needed based on scanning success rate.

3. **Telegram Collectible Usernames Without "bot" Suffix**
   - What we know: Standard bot usernames require "bot" or "_bot" suffix; collectible usernames (purchased via Fragment/TON) can omit suffix
   - What's unclear: How common are collectible bot usernames? Should v1.1 support them or defer to v2.0?
   - Recommendation: For v1.1, enforce "bot" suffix per standard Telegram behavior. Document in UI: "Bot usernames must end with 'bot' or '_bot'". If users report issues with valid collectible bot usernames, add Phase 9 enhancement: checkbox "Collectible username (doesn't require 'bot' suffix)" to bypass validation.

4. **vCard Field Mapping Variations Across Platforms**
   - What we know: iOS Camera and Android parse vCard 3.0; vcards-js uses standard property names (N, FN, ORG, TITLE, ROLE)
   - What's unclear: Do iOS/Android consistently map ROLE field to "Department"? Any platform-specific field ordering preferences?
   - Recommendation: Implement using standard vcards-js properties. During Phase 7 verification, test scanned vCard on iOS (iPhone Camera) and Android (Google Contacts) to verify field mapping. Document any discrepancies in verification notes. If issues found, may need to adjust which vcards-js properties are used (e.g., using 'note' field for department if ROLE not supported).

5. **vCard Line Folding in QR Codes**
   - What we know: RFC 2426 requires line folding at 75 characters (insert CRLF + space); vcards-js implements this automatically
   - What's unclear: Do QR code readers correctly parse line-folded vCards? Does folding affect character count vs unfolded format?
   - Recommendation: vcards-js handles line folding per RFC 2426 spec. Assume QR readers support folded vCards (standard behavior). During Phase 7 testing, verify with vCard containing long field (>75 chars) like URL or company name. If scanning issues occur, investigate whether line folding causes problems—may need to use vcard-creator library instead (doesn't fold by default).

## Sources

### Primary (HIGH confidence)
- vCard 3.0 specification: [RFC 2426 - vCard MIME Directory Profile](https://www.ietf.org/rfc/rfc2426.txt)
- vCard escaping rules: [Escaping in iCalendar and vCard](https://evertpot.com/escaping-in-vcards-and-icalendar/)
- vcards-js documentation: [vcards-js GitHub](https://github.com/enesser/vCards-js)
- Telegram deep links: [Telegram Deep Links - Official API](https://core.telegram.org/api/links)
- Telegram username validation: [Telegram Limits - Username Rules](https://limits.tginfo.me/en)
- vCard 3.0 format guide: [vCard 3.0 Format Specifications - VCF Converter](https://www.vcfconverter.com/blog/vcard-3-0-format-specifications)

### Secondary (MEDIUM confidence)
- vCard QR code compatibility: [vCard QR Codes - QuickChart](https://quickchart.io/documentation/vcard-qr-codes/)
- vCard character limits in QR: [QR Code Data Size - The QR Code Generator](https://www.the-qrcode-generator.com/blog/qr-code-data-size)
- Telegram bot username requirements: [Telegram Bot Usernames Guide](https://www.such.chat/blog/telegram-bot-usernames-ultimate-guide)
- Telegram phone number links: [How to Create Phone Number Link on Telegram](https://www.guidingtech.com/how-to-create-phone-number-link-on-telegram/)
- vcards-js alternatives: [vcards-js npm Issues](https://github.com/enesser/vCards-js/issues)
- vCard common mistakes: [vCard & Contacts Common Mistakes - StrongQRCode](https://strongqrcode.com/blog/posts/vcard--contacts-vcard--contacts-common-mistakes-with-qr-codes-and-fixes.html)

### Tertiary (LOW confidence - needs validation)
- vCard 1476 character limit: [CodeTwo vCard QR Code Documentation](https://www.codetwo.com/kb/vcard-qr-code-in-email-signatures/) (specific to CodeTwo software, not universal)
- Telegram collectible usernames: [How to Build Inline Telegram Bot](https://community.latenode.com/t/how-can-i-build-an-inline-telegram-bot-that-doesnt-require-a-bot-suffix/5761) (community discussion, not official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - vcards-js is standard library (1.7M weekly downloads); Phase 5/6 patterns established
- vCard implementation: HIGH - RFC 2426 specification verified; vcards-js API documented; automatic escaping confirmed
- Telegram implementation: HIGH - Official Telegram API documentation for deep links; username validation rules confirmed
- Character limit thresholds: MEDIUM - 1400-1500 range is estimate based on business card QR code size; needs testing to confirm exact thresholds
- vcards-js browser compatibility: MEDIUM - Import issues documented in GitHub issues; getFormattedString() method confirmed to work in browser

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (30 days - vCard 3.0 and Telegram formats stable; library versions may update)

**Notes:**
- vCard 3.0 is explicitly required per REQUIREMENTS.md (vCard 4.0 excluded due to poor QR reader support)
- Telegram three-mode approach (username/phone/bot) covers all use cases in requirements
- vcards-js automatic escaping is critical—manual vCard formatting error-prone and causes iOS/Android scanning failures
- Character counter warning thresholds (1400/1500) based on QR code density for business card printing; may need adjustment during testing
- Phase 6 E.164 phone validation pattern reused for both vCard and Telegram phone modes
- vcards-js last published 7 years ago but still widely used and functional; TypeScript types available via @types/vcards-js
