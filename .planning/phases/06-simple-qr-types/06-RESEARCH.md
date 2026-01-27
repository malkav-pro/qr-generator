# Phase 6: Simple QR Types - Research

**Researched:** 2026-01-27
**Domain:** WhatsApp and WiFi QR code generation with format-specific validation
**Confidence:** HIGH

## Summary

Phase 6 implements two QR code types: WhatsApp (simple URL-based) and WiFi (format string with escaping). WhatsApp QR codes use the official wa.me/{number}?text={message} URL format, requiring E.164 phone validation and standard URL encoding via JavaScript's encodeURIComponent(). WiFi QR codes follow the WIFI:T:{type};S:{ssid};P:{pass};H:{hidden};; format with special character escaping requirements (backslash, semicolon, colon, comma, double-quote).

The technical foundation from Phase 5 (React Hook Form + Zod + zodResolver) directly supports both implementations. WhatsApp needs basic string validation and E.164 phone regex (/^\+[1-9]\d{6,14}$/), while WiFi requires Zod .transform() for character escaping and discriminated union validation (encryption type determines password requirements).

The primary complexity is WiFi special character escaping: backslashes must be escaped FIRST (to avoid double-escaping), then semicolons, colons, commas, and quotes. iOS Camera (iOS 11+) and Android (10+) natively support WiFi QR codes, but scanner compatibility varies with escaped characters—testing recommended.

**Primary recommendation:** Use existing React Hook Form + Zod patterns from Phase 5. For WhatsApp, implement simple E.164 regex validation and encodeURIComponent() formatting. For WiFi, implement proper escape-order transforms (backslash first) and discriminated union schema for encryption-specific password validation. Consider adding country code selector (react-phone-number-input) for better UX, but basic E.164 text input satisfies v1.0 requirements.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.71.1 | Form state management | Already established in Phase 5; handles validation for both types |
| zod | 4.3.5 | Schema validation | Already established; .transform() handles WiFi escaping; .regex() for E.164 |
| @hookform/resolvers | 3.9.1+ | Zod-RHF integration | Already established; zodResolver bridges schemas to forms |

### Supporting (Optional for Enhanced UX)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-phone-number-input | Latest | Country code selector + E.164 validation | Optional enhancement for WhatsApp form; uses libphonenumber-js for validation |
| libphonenumber-js | Latest | Phone number parsing/validation | If using react-phone-number-input; provides parsePhoneNumberFromString() |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-phone-number-input | Manual country dropdown + E.164 regex | Manual approach simpler for v1.0 but worse UX (no auto-formatting, no country detection) |
| Zod .transform() escaping | Manual escape functions | Transform keeps validation + formatting co-located; manual functions separate concerns |
| encodeURIComponent() | Custom URL encoding | encodeURIComponent() is native, battle-tested, handles all edge cases (emoji, etc.) |

**Installation:**
```bash
# Core (already installed in Phase 5)
npm install react-hook-form zod @hookform/resolvers

# Optional: Enhanced phone input
npm install react-phone-number-input libphonenumber-js
```

## Architecture Patterns

### Recommended Project Structure
```
lib/
├── formatters/
│   ├── whatsapp.ts          # WhatsApp schema + formatter
│   ├── wifi.ts              # WiFi schema + formatter with escaping
│   └── index.ts             # Export QR_TYPES constant
components/
├── forms/
│   └── qr-forms/
│       ├── WhatsAppForm.tsx # Phone + message fields
│       └── WiFiForm.tsx     # SSID, password, encryption, hidden fields
lib/
└── registry.ts              # Add whatsapp/wifi to qrFormRegistry
```

### Pattern 1: WhatsApp Schema + Formatter
**What:** Simple E.164 phone validation with optional message, formatted to wa.me URL
**When to use:** WhatsApp QR type implementation
**Example:**
```typescript
// lib/formatters/whatsapp.ts
import { z } from 'zod';

export const whatsappSchema = z.object({
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+[1-9]\d{6,14}$/, 'Must be valid E.164 format (+1234567890)'),
  message: z.string()
    .max(500, 'Message must be 500 characters or less')
    .optional()
    .default(''),
});

export type WhatsAppData = z.infer<typeof whatsappSchema>;

export function formatWhatsApp(data: WhatsAppData): string {
  // Remove + prefix from phone number for wa.me format
  const cleanPhone = data.phoneNumber.replace(/^\+/, '');

  // URL encode message (handles spaces, special chars, emoji)
  const encodedMessage = data.message
    ? `?text=${encodeURIComponent(data.message)}`
    : '';

  return `https://wa.me/${cleanPhone}${encodedMessage}`;
}
```

### Pattern 2: WiFi Schema with Special Character Escaping
**What:** WiFi format string with transform-based character escaping and discriminated union for encryption types
**When to use:** WiFi QR type implementation
**Example:**
```typescript
// lib/formatters/wifi.ts
import { z } from 'zod';

// CRITICAL: Escape backslash FIRST to avoid double-escaping
function escapeWiFiSpecialChars(text: string): string {
  return text
    .replace(/\\/g, '\\\\')  // Backslash first!
    .replace(/;/g, '\\;')    // Field separator
    .replace(/:/g, '\\:')    // Key-value separator
    .replace(/,/g, '\\,')    // Value separator
    .replace(/"/g, '\\"');   // Quote character
}

// Discriminated union: password requirements vary by encryption type
export const wifiSchema = z.discriminatedUnion('encryption', [
  // Open network: no password
  z.object({
    encryption: z.literal('nopass'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less')
      .transform(escapeWiFiSpecialChars),
    hidden: z.boolean().default(false),
  }),
  // WPA/WPA2: 8-63 characters
  z.object({
    encryption: z.literal('WPA'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less')
      .transform(escapeWiFiSpecialChars),
    password: z.string()
      .min(8, 'WPA password must be at least 8 characters')
      .max(63, 'WPA password must be 63 characters or less')
      .transform(escapeWiFiSpecialChars),
    hidden: z.boolean().default(false),
  }),
  // WEP: 5 or 13 characters exactly
  z.object({
    encryption: z.literal('WEP'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less')
      .transform(escapeWiFiSpecialChars),
    password: z.string()
      .refine(
        (val) => val.length === 5 || val.length === 13,
        'WEP password must be exactly 5 or 13 characters'
      )
      .transform(escapeWiFiSpecialChars),
    hidden: z.boolean().default(false),
  }),
]);

export type WiFiData = z.infer<typeof wifiSchema>;

export function formatWiFi(data: WiFiData): string {
  const encryptionType = data.encryption === 'nopass' ? '' : data.encryption;
  const password = 'password' in data ? data.password : '';
  const hiddenFlag = data.hidden ? 'true' : '';

  // Format: WIFI:T:{type};S:{ssid};P:{pass};H:{hidden};;
  // Note: Double semicolon at end is REQUIRED
  return `WIFI:T:${encryptionType};S:${data.ssid};P:${password};H:${hiddenFlag};;`;
}
```

### Pattern 3: WhatsApp Form Component
**What:** Form with phone number field (E.164 text input) and optional message textarea
**When to use:** WhatsApp QR type form implementation
**Example:**
```typescript
// components/forms/qr-forms/WhatsAppForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { whatsappSchema, formatWhatsApp, WhatsAppData } from '@/lib/formatters/whatsapp';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (qrData: string) => void;
  initialValue?: WhatsAppData;
};

export function WhatsAppForm({ onDataChange, initialValue }: Props) {
  const { control, handleSubmit, watch } = useForm<WhatsAppData>({
    resolver: zodResolver(whatsappSchema),
    mode: 'onBlur',
    defaultValues: initialValue || {
      phoneNumber: '',
      message: '',
    },
  });

  // Auto-update QR code on valid form changes
  const formData = watch();
  useEffect(() => {
    const result = whatsappSchema.safeParse(formData);
    if (result.success) {
      onDataChange(formatWhatsApp(result.data));
    }
  }, [formData, onDataChange]);

  return (
    <form>
      <FormFieldSet
        control={control}
        name="phoneNumber"
        label="Phone Number"
        render={(field) => (
          <input
            {...field}
            type="tel"
            placeholder="+1234567890"
            aria-label="Phone number in E.164 format with + prefix"
          />
        )}
      />
      <p className="hint">
        Enter phone number with country code (e.g., +1 for USA)
      </p>

      <FormFieldSet
        control={control}
        name="message"
        label="Pre-filled Message (optional)"
        render={(field) => (
          <textarea
            {...field}
            placeholder="Hello! I'd like to chat..."
            maxLength={500}
            rows={4}
          />
        )}
      />
      <p className="hint">
        {field.value.length}/500 characters
      </p>
    </form>
  );
}
```

### Pattern 4: WiFi Form with Conditional Password Field
**What:** Form with SSID, encryption selector (hides/shows password), password, and hidden checkbox
**When to use:** WiFi QR type form implementation
**Example:**
```typescript
// components/forms/qr-forms/WiFiForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wifiSchema, formatWiFi, WiFiData } from '@/lib/formatters/wifi';
import { FormFieldSet } from '../FormFieldSet';

type Props = {
  onDataChange: (qrData: string) => void;
  initialValue?: WiFiData;
};

export function WiFiForm({ onDataChange, initialValue }: Props) {
  const { control, handleSubmit, watch } = useForm<WiFiData>({
    resolver: zodResolver(wifiSchema),
    mode: 'onBlur',
    defaultValues: initialValue || {
      encryption: 'WPA',
      ssid: '',
      password: '',
      hidden: false,
    },
  });

  const encryption = watch('encryption');
  const needsPassword = encryption !== 'nopass';

  // Auto-update QR code on valid form changes
  const formData = watch();
  useEffect(() => {
    const result = wifiSchema.safeParse(formData);
    if (result.success) {
      onDataChange(formatWiFi(result.data));
    }
  }, [formData, onDataChange]);

  return (
    <form>
      <FormFieldSet
        control={control}
        name="ssid"
        label="Network Name (SSID)"
        render={(field) => (
          <input
            {...field}
            type="text"
            placeholder="MyHomeNetwork"
            maxLength={32}
            aria-label="WiFi network name"
          />
        )}
      />

      <FormFieldSet
        control={control}
        name="encryption"
        label="Security Type"
        render={(field) => (
          <select {...field} aria-label="WiFi encryption type">
            <option value="WPA">WPA/WPA2 (recommended)</option>
            <option value="WEP">WEP (legacy)</option>
            <option value="nopass">Open Network</option>
          </select>
        )}
      />

      {needsPassword && (
        <FormFieldSet
          control={control}
          name="password"
          label="Password"
          render={(field) => (
            <input
              {...field}
              type="password"
              placeholder={encryption === 'WEP' ? '5 or 13 characters' : 'Min 8 characters'}
              maxLength={63}
              aria-label="WiFi password"
            />
          )}
        />
      )}

      <FormFieldSet
        control={control}
        name="hidden"
        label="Hidden Network"
        render={(field) => (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              aria-label="Is this a hidden network?"
            />
            <span>This is a hidden network</span>
          </label>
        )}
      />
    </form>
  );
}
```

### Anti-Patterns to Avoid
- **URL encoding the entire wa.me URL:** Only encode the message parameter, not the phone number or URL structure. Correct: `wa.me/1234?text=${encodeURIComponent(msg)}`, wrong: `encodeURIComponent('wa.me/1234?text=msg')`
- **Wrong escape order for WiFi:** Escaping semicolon before backslash causes double-escaping. ALWAYS escape backslash first.
- **Using + in wa.me phone number:** The wa.me format expects phone without + prefix. Strip it: `phoneNumber.replace(/^\+/, '')`.
- **Single semicolon WiFi terminator:** WiFi format MUST end with `;;` (double semicolon), not `;` (single).
- **Not validating SSID byte length:** SSID max is 32 **bytes**, not characters. Multi-byte UTF-8 characters can exceed limit. Use `.max(32)` for practical limit.
- **Omitting encryption type for open networks:** Use `T:;` or `T:nopass;`, not omitting T parameter entirely.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| E.164 phone validation | Custom regex with country rules | Zod regex /^\+[1-9]\d{6,14}$/ (basic) or libphonenumber-js (production) | E.164 regex provides structure validation; libphonenumber-js handles country-specific rules (area codes, number lengths); custom validation misses edge cases |
| URL encoding WhatsApp messages | Manual replace() chains for spaces/special chars | encodeURIComponent() | Native JavaScript function handles all URL-unsafe characters including emoji, RTL text, and extended Unicode; tested across all browsers |
| Country code selector | Manual dropdown with flag images | react-phone-number-input | Library includes 240+ country codes, flag sprites, auto-formatting, and libphonenumber-js validation; building from scratch misses accessibility, localization |
| WiFi special character escaping | Replace each char individually | Ordered escape function (backslash first) | Wrong order causes double-escaping (e.g., `\;` becomes `\\;`); battle-tested escape order prevents scanner failures |
| WiFi encryption validation | Single schema with optional password | Zod discriminated union | Union automatically adjusts password rules per encryption type; single schema requires complex conditional validation with worse error messages |

**Key insight:** Character encoding (URL encoding, WiFi escaping) and phone number validation have hidden complexity. Emoji, multi-byte characters, and international phone formats break naive implementations. Use native functions (encodeURIComponent) and established libraries (libphonenumber-js) that handle edge cases correctly.

## Common Pitfalls

### Pitfall 1: wa.me Phone Number Format Confusion
**What goes wrong:** Including + prefix in wa.me URL (wa.me/+1234567890) or forgetting country code
**Why it happens:** E.164 format uses + prefix; developers assume wa.me uses same format
**How to avoid:** Store phone in E.164 format (+1234567890) for validation, strip + for wa.me URL: `phoneNumber.replace(/^\+/, '')`. Validate with E.164 regex, format without +.
**Warning signs:** WhatsApp links open but show "phone number not found" error; QR codes scan but don't launch WhatsApp

### Pitfall 2: WiFi Backslash Double-Escaping
**What goes wrong:** Password "pass\word" becomes "pass\\\\word" in QR code; scanner fails to parse
**Why it happens:** Escaping semicolon first converts "\" to "\;" then escaping backslash converts "\;" to "\\;"
**How to avoid:** ALWAYS escape backslash first in escape function. Order: `.replace(/\\/g, '\\\\')` then `.replace(/;/g, '\\;')`. Test with passwords containing multiple special characters.
**Warning signs:** QR codes with backslashes in passwords fail to scan; manually typing password works but QR code doesn't

### Pitfall 3: WiFi Format Terminator Missing
**What goes wrong:** WiFi QR code ends with single `;` instead of `;;`; iOS/Android cameras don't recognize as WiFi QR
**Why it happens:** Developers see single semicolons separating fields and assume one at end
**How to avoid:** Hardcode `;;` at end of format string: `return WIFI:T:${type};S:${ssid};P:${pass};H:${hidden};;`. Add test case verifying double semicolon.
**Warning signs:** Generated QR codes scan as plain text instead of triggering WiFi connection prompt

### Pitfall 4: E.164 Accepting Invalid Numbers (+0...)
**What goes wrong:** Validation accepts +0123456789 which is invalid E.164 (country codes never start with 0)
**Why it happens:** Common E.164 regex /^\+[0-9]\d{6,14}$/ allows [0-9] after +
**How to avoid:** Use corrected regex /^\+[1-9]\d{6,14}$/ which requires [1-9] after +. For production, use libphonenumber-js parsePhoneNumberFromString() and .isValid().
**Warning signs:** WhatsApp links with +0... don't work; users complain about invalid phone numbers

### Pitfall 5: encodeURIComponent() on Entire URL
**What goes wrong:** Entire wa.me URL is encoded, resulting in https%3A%2F%2Fwa.me%2F... which breaks QR code links
**Why it happens:** Developers apply encodeURIComponent() to full URL thinking it's safe
**How to avoid:** Only encode the message parameter: `wa.me/${phone}?text=${encodeURIComponent(message)}`. Never encode protocol, domain, or phone number.
**Warning signs:** QR codes scan but links don't open WhatsApp; URLs show encoded slashes and colons

### Pitfall 6: WiFi Password Validation Without Encryption Context
**What goes wrong:** Form validates WPA password length (8+ chars) even when encryption is WEP (requires exactly 5 or 13)
**Why it happens:** Using single schema with optional password field and generic min/max validation
**How to avoid:** Use Zod discriminated union with encryption as discriminator. Each union member has encryption-specific password validation. Password field conditionally renders based on encryption.
**Warning signs:** Form shows "password too short" error when user enters valid 5-char WEP password; validation rules don't match selected encryption

### Pitfall 7: Hidden Network Parameter Inconsistency
**What goes wrong:** Hidden network parameter set to "false" string instead of empty string; some scanners misinterpret
**Why it happens:** Boolean checkbox value (false) converted directly to string without mapping
**How to avoid:** Map boolean to WiFi format spec: `const hiddenFlag = data.hidden ? 'true' : '';`. Only use 'true' or empty string, never 'false'.
**Warning signs:** Hidden networks show up as non-hidden when connecting; QR codes work on some devices but not others

### Pitfall 8: SSID Byte Length vs Character Length
**What goes wrong:** Form accepts 32 characters but SSID with emoji (multi-byte) exceeds 32-byte limit; router rejects or truncates
**Why it happens:** JavaScript .length counts UTF-16 code units; WiFi SSID limit is 32 bytes (UTF-8)
**How to avoid:** For v1.0, use conservative character limit (.max(32)). For v2.0, add byte-length validation: `.refine((str) => new Blob([str]).size <= 32, 'Max 32 bytes')`.
**Warning signs:** Users report truncated network names with emoji; QR codes generate but networks don't match router settings

## Code Examples

Verified patterns from official sources:

### E.164 Phone Validation (Corrected Regex)
```typescript
// Source: https://ihateregex.io/expr/e164-phone/ and Phase 5 research
import { z } from 'zod';

// CORRECT: Rejects +0... (country codes start with 1-9)
const phoneE164 = z.string()
  .min(1, 'Phone number is required')
  .regex(/^\+[1-9]\d{6,14}$/, 'Must be valid E.164 format (+1234567890)');

// WRONG: Accepts +0... (invalid)
const phoneWrong = z.string().regex(/^\+[0-9]\d{6,14}$/);

// PRODUCTION: Use libphonenumber-js for country-specific validation
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const phoneProduction = z.string()
  .transform((val, ctx) => {
    const parsed = parsePhoneNumberFromString(val);
    if (!parsed || !parsed.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid phone number',
      });
      return z.NEVER;
    }
    return parsed.format('E.164'); // Returns +1234567890
  });
```

### WhatsApp URL Encoding
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function formatWhatsApp(phoneNumber: string, message: string): string {
  // Strip + prefix for wa.me format
  const cleanPhone = phoneNumber.replace(/^\+/, '');

  // encodeURIComponent() handles:
  // - Spaces → %20
  // - Special chars (:, ?, &, =, etc.) → percent-encoded
  // - Emoji → UTF-8 percent-encoded
  // - Extended Unicode → proper encoding
  const encodedMessage = message
    ? `?text=${encodeURIComponent(message)}`
    : '';

  return `https://wa.me/${cleanPhone}${encodedMessage}`;
}

// Example:
formatWhatsApp('+12025550172', 'Hello! 😊');
// Returns: https://wa.me/12025550172?text=Hello!%20%F0%9F%98%8A
```

### WiFi Special Character Escaping (Correct Order)
```typescript
// Source: https://feeding.cloud.geek.nz/posts/encoding-wifi-access-point-passwords-qr-code/
// and https://wifiqrcode.app/guides/qr-code-format-technical

// CORRECT: Backslash first
function escapeWiFiSpecialChars(text: string): string {
  return text
    .replace(/\\/g, '\\\\')  // Escape backslash FIRST
    .replace(/;/g, '\\;')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"');
}

// WRONG: Backslash last causes double-escaping
function escapeWrong(text: string): string {
  return text
    .replace(/;/g, '\\;')    // Converts ";" to "\;"
    .replace(/\\/g, '\\\\'); // Converts "\;" to "\\;" (wrong!)
}

// Example:
escapeWiFiSpecialChars('Pass\\word:123');
// Correct: Pass\\\\word\\:123
// Wrong order produces: Pass\\\\;word\\:123
```

### WiFi Format String Generation
```typescript
// Source: https://wifiqrcode.app/guides/qr-code-format-technical
function formatWiFi(data: {
  encryption: 'WPA' | 'WEP' | 'nopass';
  ssid: string;
  password?: string;
  hidden: boolean;
}): string {
  // Encryption type: WPA, WEP, or empty for open
  const encryptionType = data.encryption === 'nopass' ? '' : data.encryption;

  // Password: empty string for open networks
  const password = data.password || '';

  // Hidden: 'true' or empty string (never 'false')
  const hiddenFlag = data.hidden ? 'true' : '';

  // Format: WIFI:T:{type};S:{ssid};P:{pass};H:{hidden};;
  // CRITICAL: Double semicolon at end is REQUIRED
  return `WIFI:T:${encryptionType};S:${data.ssid};P:${password};H:${hiddenFlag};;`;
}

// Examples:
formatWiFi({ encryption: 'WPA', ssid: 'My\\;Network', password: 'Pass\\:123', hidden: false });
// Returns: WIFI:T:WPA;S:My\\;Network;P:Pass\\:123;H:;;

formatWiFi({ encryption: 'nopass', ssid: 'OpenWiFi', hidden: true });
// Returns: WIFI:T:;S:OpenWiFi;P:;H:true;;
```

### WiFi Discriminated Union Schema
```typescript
// Source: Phase 5 research (Zod discriminated unions) + WiFi spec
import { z } from 'zod';

function escapeWiFiSpecialChars(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"');
}

export const wifiSchema = z.discriminatedUnion('encryption', [
  // Open network: no password field
  z.object({
    encryption: z.literal('nopass'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less')
      .transform(escapeWiFiSpecialChars),
    hidden: z.boolean().default(false),
  }),
  // WPA/WPA2: 8-63 characters
  z.object({
    encryption: z.literal('WPA'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less')
      .transform(escapeWiFiSpecialChars),
    password: z.string()
      .min(8, 'WPA password must be at least 8 characters')
      .max(63, 'WPA password must be 63 characters or less')
      .transform(escapeWiFiSpecialChars),
    hidden: z.boolean().default(false),
  }),
  // WEP: exactly 5 or 13 characters
  z.object({
    encryption: z.literal('WEP'),
    ssid: z.string()
      .min(1, 'Network name is required')
      .max(32, 'Network name must be 32 characters or less')
      .transform(escapeWiFiSpecialChars),
    password: z.string()
      .refine(
        (val) => val.length === 5 || val.length === 13,
        'WEP password must be exactly 5 or 13 characters'
      )
      .transform(escapeWiFiSpecialChars),
    hidden: z.boolean().default(false),
  }),
]);

export type WiFiData = z.infer<typeof wifiSchema>;
// TypeScript infers: { encryption: 'nopass', ssid: string, hidden: boolean }
//                 | { encryption: 'WPA', ssid: string, password: string, hidden: boolean }
//                 | { encryption: 'WEP', ssid: string, password: string, hidden: boolean }
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual phone validation | libphonenumber-js | Pre-2020 | Library handles 240+ countries, changing numbering plans, area code rules; manual regex misses edge cases |
| Custom URL encoding | encodeURIComponent() | Native JavaScript | Always use native function; handles emoji, extended Unicode, tested across browsers |
| WiFi QR without escaping | Escaped special characters | Ongoing | Scanner support varies; always escape per spec but provide toggle if users report issues |
| Manual country dropdown | react-phone-number-input | 2020+ | Library includes flags, auto-formatting, validation; building from scratch poor UX |
| Single WiFi schema | Discriminated union | Zod v3+ (2022) | Union provides encryption-specific validation; single schema requires complex conditional logic |
| wa.me with + prefix | Strip + for wa.me | WhatsApp spec | wa.me expects phone without + prefix; E.164 uses + for storage/validation |

**Deprecated/outdated:**
- **WEP encryption:** Deprecated security protocol (2004); still supported for legacy device compatibility but strongly discouraged
- **wa.me with api.whatsapp.com:** Old format api.whatsapp.com deprecated in favor of wa.me short links
- **WiFi QR without double semicolon:** Some old generators used single `;` terminator; modern spec requires `;;`
- **Country code selectors without libphonenumber-js:** Manual dropdowns lack validation, auto-formatting, and accessibility

## Open Questions

Things that couldn't be fully resolved:

1. **react-phone-number-input Package Access**
   - What we know: Library exists on npm, actively maintained, uses libphonenumber-js, exports country selector components
   - What's unclear: npm registry returned 403 error during research; couldn't verify exact latest version number or installation details
   - Recommendation: Use `npm install react-phone-number-input libphonenumber-js` during implementation. Version likely v4.x based on GitHub activity. If npm install fails, fallback to basic E.164 text input (satisfies v1.0 requirements).

2. **WiFi Hidden Network Scanner Compatibility**
   - What we know: iOS Camera (iOS 11+) and Android (10+) support WiFi QR codes natively; H parameter accepts 'true' or empty string
   - What's unclear: Some user reports indicate hidden network QR codes fail on certain Android implementations; no definitive compatibility matrix found
   - Recommendation: Implement hidden network toggle as specified. Document in user help: "Hidden network support varies by device. If QR code doesn't work, manually connect using SSID and password." Test with iOS Camera and stock Android camera during Phase 6 implementation.

3. **WiFi Special Character Scanner Compatibility**
   - What we know: WiFi spec requires escaping `\;:,"` but some sources mention "most scanners do not follow special character escaping standards"
   - What's unclear: Which specific scanners (iOS Camera vs third-party apps) support escaped vs unescaped characters; no 2026 test matrix found
   - Recommendation: Implement spec-compliant escaping (always escape special characters). If Phase 6 testing reveals scanner issues, add Phase 9 enhancement: UI toggle "Having trouble scanning? Try unescaped format." Test with passwords containing semicolons and backslashes on iOS/Android.

4. **SSID Byte Length Validation**
   - What we know: SSID limit is 32 bytes (not characters); multi-byte UTF-8 characters can cause issues
   - What's unclear: How common are emoji/multi-byte characters in SSIDs? Do routers enforce byte limit or character limit?
   - Recommendation: For v1.0, use conservative character limit (.max(32)). Document in help: "Network names with emoji may be truncated." If user feedback indicates issues, add Phase 9 enhancement: byte-length validation with `.refine((str) => new Blob([str]).size <= 32)`.

5. **WPA3 Encryption Support**
   - What we know: WPA3 is latest standard (2018+); WiFi QR format supports 'WPA3' as encryption type value
   - What's unclear: Scanner support for explicit 'WPA3' value vs treating as 'WPA'; password requirements for WPA3 (likely same as WPA2: 8-63 chars)
   - Recommendation: For v1.0, use 'WPA' value (works for WPA/WPA2/WPA3 due to backward compatibility). Document in help: "WPA option supports WPA, WPA2, and WPA3 networks." If user feedback requests explicit WPA3, add to discriminated union in Phase 9.

## Sources

### Primary (HIGH confidence)
- WhatsApp wa.me format: [WhatsApp Link Generator](https://www.delightchat.io/whatsapp-link-generator) and [Wati.io Click-to-Chat](https://support.wati.io/en/articles/11462980-how-to-create-whatsapp-click-to-chat-links)
- WiFi QR format specification: [WiFi QR Code Format Technical Guide](https://wifiqrcode.app/guides/qr-code-format-technical)
- WiFi special character escaping: [Encoding WiFi Passwords in QR Codes](https://feeding.cloud.geek.nz/posts/encoding-wifi-access-point-passwords-qr-code/)
- E.164 format: [iHateRegex E.164](https://ihateregex.io/expr/e164-phone/) and [Twilio E.164 Glossary](https://www.twilio.com/docs/glossary/what-e164)
- encodeURIComponent(): [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- WPA password requirements: [RouterSecurity.org WiFi Passwords](https://routersecurity.org/wifi.passwords.php)
- SSID length: [Microsoft Learn 802.11 SSID](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-lltd/364f7ef1-798f-4f46-93be-af7c154092a3)
- Zod transforms: [Zod Transform Guide](https://tecktol.com/zod-transform/)

### Secondary (MEDIUM confidence)
- react-phone-number-input: [Croct Blog - Best React Phone Libraries 2026](https://blog.croct.com/post/best-react-phone-number-input-libraries)
- WiFi encryption types: [QR Code Dynamic WiFi Generator](https://qrcodedynamic.com/qr/whatsapp) and [Utiltica WiFi QR Generator](https://utiltica.com/qr-tools/wifi-qr-code-generator.html)
- WiFi QR scanner compatibility: [Croma Unboxed - Scan WiFi QR](https://www.croma.com/unboxed/how-to-scan-wi-fi-qr-code-from-iphone-to-android-easily)
- Hidden network parameter: [QR Code for WiFi Credentials](https://www.drashsmith.com/Blog/qr-code-for-wifi-network-credentials)
- WEP password length: [Garmin WiFi Password Length](https://support.garmin.com/en-US/?faq=aC6mOWyuda1ClsYQ22lgyA)

### Tertiary (LOW confidence - needs validation)
- WPA3 support in WiFi QR: [UI Community WPA3 Discussion](https://community.ui.com/questions/Looking-for-QR-Code-or-alternatives-for-WPA3-How-to-quickly-connect-clients-to-WPA3-only-networks/43450e96-bcc9-4959-98ee-b8e2266d1a1a) (community discussion, not authoritative)
- Hidden network scanner issues: [ZXing Issue #516](https://github.com/zxing/zxing/issues/516) (open issue from 2013, may be outdated)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Uses established Phase 5 stack (React Hook Form + Zod); no new core dependencies
- WhatsApp implementation: HIGH - Official wa.me format documented; E.164 validation verified; encodeURIComponent() is native JavaScript
- WiFi implementation: HIGH - Format specification verified across multiple sources; escaping order confirmed; encryption types documented
- Scanner compatibility: MEDIUM - iOS/Android native support confirmed but special character escaping compatibility varies by device (needs testing)

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - format specs stable but scanner support evolves)

**Notes:**
- All format specifications verified against multiple authoritative sources
- WhatsApp and WiFi formats are stable standards (unlikely to change)
- Scanner compatibility varies by device/OS version; testing required during implementation
- react-phone-number-input is optional enhancement; basic E.164 text input satisfies v1.0 requirements
- WiFi special character escaping order is CRITICAL (backslash first) to avoid double-escaping bugs
